const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { auth, requireSuperAdmin } = require('../middleware/auth');
const router = express.Router();

// Login (handles both superadmin and regular users)
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if it's superadmin login
    if (username === process.env.SUPERADMIN_USERNAME) {
      if (password === process.env.SUPERADMIN_PASSWORD) {
        const token = jwt.sign(
          { 
            userId: 'superadmin', 
            role: 'superadmin',
            username: process.env.SUPERADMIN_USERNAME
          },
          process.env.JWT_SECRET || 'fallback-secret',
          { expiresIn: '8h' }
        );

        return res.json({
          message: 'SuperAdmin login successful',
          token,
          user: {
            id: 'superadmin',
            username: process.env.SUPERADMIN_USERNAME,
            role: 'superadmin',
            firstName: 'Super',
            lastName: 'Admin',
            email: 'superadmin@euroshub.com'
          }
        });
      } else {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
    }

    // Regular user login
    const user = await User.findOne({ username, isActive: true });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT
    const token = jwt.sign(
      { 
        userId: user._id,
        role: user.role,
        username: user.username
      },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '8h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        department: user.department,
        position: user.position
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Create user (SuperAdmin only)
router.post('/create-user', auth, requireSuperAdmin, async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      firstName,
      lastName,
      role,
      phone,
      department,
      position
    } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'User already exists with this email or username'
      });
    }

    // Create user
    const user = new User({
      username,
      email,
      password,
      firstName,
      lastName,
      role,
      phone,
      department,
      position,
      createdBy: req.user.role === 'superadmin' ? null : req.user._id
    });

    await user.save();

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        department: user.department,
        position: user.position
      }
    });
  } catch (error) {
    console.error('User creation error:', error);
    res.status(500).json({ message: 'Server error during user creation' });
  }
});

// Get all users (SuperAdmin only)
router.get('/users', auth, requireSuperAdmin, async (req, res) => {
  try {
    const users = await User.find({})
      .select('-password')
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error while fetching users' });
  }
});

// Update user status (SuperAdmin only)
router.patch('/users/:id/status', auth, requireSuperAdmin, async (req, res) => {
  try {
    const { isActive } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      user
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ message: 'Server error while updating user status' });
  }
});

// Logout
router.post('/logout', auth, (req, res) => {
  res.json({ message: 'Logout successful' });
});

module.exports = router;