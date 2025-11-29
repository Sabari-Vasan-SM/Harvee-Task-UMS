import User from '../models/User.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/token.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to sanitize user object
const sanitizeUser = (user) => {
  const userObj = user.toObject ? user.toObject() : user;
  const { password, refreshToken, __v, ...sanitized } = userObj;
  return sanitized;
};

// Register new user
export const register = async (req, res) => {
  try {
    const { name, email, phone, password, address, state, city, country, pincode } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      // Clean up uploaded file if exists
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      
      if (existingUser.email === email) {
        return res.status(400).json({ errors: [{ field: 'email', msg: 'Email already exists' }] });
      }
      return res.status(400).json({ errors: [{ field: 'phone', msg: 'Phone already exists' }] });
    }

    // Create user object
    const userData = {
      name,
      email,
      phone,
      password,
      address,
      state,
      city,
      country,
      pincode,
      profile_image: req.file ? `/uploads/${req.file.filename}` : '',
    };

    const user = new User(userData);
    await user.save();

    // Generate tokens
    const accessToken = generateAccessToken({ userId: user._id, role: user.role });
    const refreshToken = generateRefreshToken({ userId: user._id });

    // Save refresh token to user
    user.refreshToken = refreshToken;
    await user.save();

    res.status(201).json({
      message: 'User registered',
      user: sanitizeUser(user),
      accessToken,
      refreshToken,
    });
  } catch (error) {
    // Clean up uploaded file if exists
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }

    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ errors: [{ field, msg: `${field} already exists` }] });
    }

    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    // Find user by email or phone
    const user = await User.findOne({
      $or: [{ email: identifier }, { phone: identifier }],
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate tokens
    const accessToken = generateAccessToken({ userId: user._id, role: user.role });
    const refreshToken = generateRefreshToken({ userId: user._id });

    // Save refresh token
    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      message: 'Login successful',
      user: sanitizeUser(user),
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Refresh access token
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token required' });
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);

    // Find user and check if refresh token matches
    const user = await User.findById(decoded.userId);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    // Generate new access token
    const newAccessToken = generateAccessToken({ userId: user._id, role: user.role });
    
    // Optionally generate new refresh token
    const newRefreshToken = generateRefreshToken({ userId: user._id });
    user.refreshToken = newRefreshToken;
    await user.save();

    res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Invalid or expired refresh token' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
