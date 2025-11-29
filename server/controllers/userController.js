import User from '../models/User.js';
import bcrypt from 'bcrypt';
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

// Get all users with pagination, search, and filters
export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', state = '', city = '' } = req.query;

    // Build query
    const query = {};
    
    // Search by name, email, or phone
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by state
    if (state) {
      query.state = { $regex: state, $options: 'i' };
    }

    // Filter by city
    if (city) {
      query.city = { $regex: city, $options: 'i' };
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await User.countDocuments(query);

    const users = await User.find(query)
      .select('-password -refreshToken')
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      results: users.map(sanitizeUser),
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single user by ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    // Admin can view any user; user can view only their own profile
    if (req.user.role !== 'admin' && req.user._id.toString() !== id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const user = await User.findById(id).select('-password -refreshToken');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(sanitizeUser(user));
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Admin can edit any user; user can edit only their own profile
    if (req.user.role !== 'admin' && req.user._id.toString() !== id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const user = await User.findById(id);

    if (!user) {
      // Clean up uploaded file if exists
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields
    const { name, email, phone, password, address, state, city, country, pincode, role } = req.body;

    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (address !== undefined) user.address = address;
    if (state) user.state = state;
    if (city) user.city = city;
    if (country) user.country = country;
    if (pincode) user.pincode = pincode;
    
    // Only admin can change roles
    if (role && req.user.role === 'admin') {
      user.role = role;
    }

    // Update password if provided
    if (password) {
      user.password = password; // Will be hashed by pre-save hook
    }

    // Handle profile image update
    if (req.file) {
      // Delete old image if exists
      if (user.profile_image) {
        const oldRel = user.profile_image.replace(/^[/\\]+/, '');
        const oldImagePath = path.join(__dirname, '..', oldRel);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      user.profile_image = `/uploads/${req.file.filename}`;
    }

    await user.save();

    res.json({
      message: 'User updated successfully',
      user: sanitizeUser(user),
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

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete profile image if exists
    if (user.profile_image) {
      const rel = user.profile_image.replace(/^[/\\]+/, '');
      const imagePath = path.join(__dirname, '..', rel);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await User.findByIdAndDelete(id);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
