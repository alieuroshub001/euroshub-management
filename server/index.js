const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const connectDB = require('./config/database');
const User = require('./models/User');
const Message = require('./models/Message');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174"], // Allow both ports
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Socket.IO middleware for authentication
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return next(new Error('Authentication error'));
    }
    
    socket.userId = user._id.toString();
    socket.username = user.username;
    next();
  } catch (err) {
    next(new Error('Authentication error'));
  }
});

// Socket.IO connection handling
io.on('connection', async (socket) => {
  console.log(`User ${socket.username} connected:`, socket.id);
  
  // Update user online status
  await User.findByIdAndUpdate(socket.userId, { 
    isOnline: true,
    lastSeen: new Date() 
  });
  
  // Join user to their personal room
  socket.join(socket.userId);
  
  // Broadcast user online status to all clients
  socket.broadcast.emit('user-online', {
    userId: socket.userId,
    username: socket.username
  });

  // Handle sending messages
  socket.on('send-message', async (data) => {
    try {
      const { receiverId, content } = data;
      
      const message = new Message({
        sender: socket.userId,
        receiver: receiverId,
        content: content.trim()
      });
      
      await message.save();
      await message.populate('sender', 'username');
      
      // Send to receiver if online
      io.to(receiverId).emit('new-message', message);
      
      // Send confirmation back to sender
      socket.emit('message-sent', message);
      
    } catch (error) {
      socket.emit('message-error', { message: 'Failed to send message' });
    }
  });

  // Handle typing indicators
  socket.on('typing', (data) => {
    socket.to(data.receiverId).emit('user-typing', {
      userId: socket.userId,
      username: socket.username
    });
  });

  socket.on('stop-typing', (data) => {
    socket.to(data.receiverId).emit('user-stop-typing', {
      userId: socket.userId
    });
  });

  // Handle disconnect
  socket.on('disconnect', async () => {
    console.log(`User ${socket.username} disconnected:`, socket.id);
    
    // Update user offline status
    await User.findByIdAndUpdate(socket.userId, { 
      isOnline: false,
      lastSeen: new Date() 
    });
    
    // Broadcast user offline status
    socket.broadcast.emit('user-offline', {
      userId: socket.userId,
      username: socket.username
    });
  });
});

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'EurosHub Management API is running!' });
});

// API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/chat', require('./routes/chat'));

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});