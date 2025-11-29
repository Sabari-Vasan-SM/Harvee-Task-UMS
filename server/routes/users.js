import express from 'express';
import { body } from 'express-validator';
import { getAllUsers, getUserById, updateUser, deleteUser } from '../controllers/userController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';
import { handleValidationErrors } from '../middleware/validationMiddleware.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Validation rules for updating user
const updateUserValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name must contain only alphabets and spaces'),
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
  body('phone')
    .optional()
    .trim()
    .matches(/^\d{10,15}$/)
    .withMessage('Phone must be 10-15 digits'),
  body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .matches(/\d/)
    .withMessage('Password must contain at least one digit'),
  body('address')
    .optional()
    .trim()
    .isLength({ max: 150 })
    .withMessage('Address cannot exceed 150 characters'),
  body('state')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('State cannot be empty'),
  body('city')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('City cannot be empty'),
  body('country')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Country cannot be empty'),
  body('pincode')
    .optional()
    .trim()
    .matches(/^\d{4,10}$/)
    .withMessage('Pincode must be 4-10 digits'),
];

// GET /api/users - Get all users (Admin only)
router.get('/', authMiddleware, adminMiddleware, getAllUsers);

// GET /api/users/:id - Get user by ID (Admin or self)
router.get('/:id', authMiddleware, getUserById);

// PUT /api/users/:id - Update user (Admin or self)
router.put(
  '/:id',
  authMiddleware,
  upload.single('profile_image'),
  updateUserValidation,
  handleValidationErrors,
  updateUser
);

// DELETE /api/users/:id - Delete user (Admin only)
router.delete('/:id', authMiddleware, adminMiddleware, deleteUser);

export default router;
