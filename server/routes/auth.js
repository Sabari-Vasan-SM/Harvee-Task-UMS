import express from 'express';
import { body } from 'express-validator';
import { register, login, refreshToken } from '../controllers/authController.js';
import { handleValidationErrors } from '../middleware/validationMiddleware.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Validation rules for registration
const registerValidation = [
  body('name')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name must contain only alphabets and spaces'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
  body('phone')
    .trim()
    .matches(/^\d{10,15}$/)
    .withMessage('Phone must be 10-15 digits'),
  body('password')
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
    .trim()
    .notEmpty()
    .withMessage('State is required'),
  body('city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),
  body('country')
    .trim()
    .notEmpty()
    .withMessage('Country is required'),
  body('pincode')
    .trim()
    .matches(/^\d{4,10}$/)
    .withMessage('Pincode must be 4-10 digits'),
];

// Validation rules for login
const loginValidation = [
  body('identifier')
    .trim()
    .notEmpty()
    .withMessage('Email or phone is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

// POST /api/auth/register
router.post(
  '/register',
  upload.single('profile_image'),
  registerValidation,
  handleValidationErrors,
  register
);

// POST /api/auth/login
router.post(
  '/login',
  loginValidation,
  handleValidationErrors,
  login
);

// POST /api/auth/refresh-token
router.post('/refresh-token', refreshToken);

export default router;
