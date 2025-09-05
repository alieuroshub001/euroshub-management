const express = require('express');
const Message = require('../models/Message');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Get all users (for user list)
router.get('/users', auth, async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } })
      .select('username email isOnline lastSeen')
      .sort({ isOnline: -1, lastSeen: -1 });
    
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Get conversation between two users
router.get('/messages/:receiverId', auth, async (req, res) => {
  try {
    const { receiverId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: receiverId },
        { sender: receiverId, receiver: req.user._id }
      ]
    })
    .populate('sender', 'username')
    .populate('receiver', 'username')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);
    
    // Mark messages as read
    await Message.updateMany(
      { sender: receiverId, receiver: req.user._id, isRead: false },
      { isRead: true, readAt: new Date() }
    );
    
    res.json(messages.reverse());
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages' });
  }
});

// Send a message
router.post('/messages', auth, async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    
    if (!content.trim()) {
      return res.status(400).json({ message: 'Message content cannot be empty' });
    }
    
    const message = new Message({
      sender: req.user._id,
      receiver: receiverId,
      content: content.trim()
    });
    
    await message.save();
    
    // Populate sender info
    await message.populate('sender', 'username');
    await message.populate('receiver', 'username');
    
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Error sending message' });
  }
});

// Get unread message count
router.get('/unread-count', auth, async (req, res) => {
  try {
    const count = await Message.countDocuments({
      receiver: req.user._id,
      isRead: false
    });
    
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching unread count' });
  }
});

module.exports = router;