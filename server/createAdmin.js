import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@example.com' });
    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('Email: admin@example.com');
      console.log('Password: admin123');
      await mongoose.connection.close();
      process.exit(0);
    }

    // Create admin user - password will be hashed by pre-save hook
    const admin = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      phone: '1234567890',
      password: 'admin123', // Will be hashed by pre-save hook
      state: 'California',
      city: 'San Francisco',
      country: 'USA',
      pincode: '94102',
      role: 'admin',
    });

    await admin.save();

    console.log('✓ Admin user created successfully!');
    console.log('Email: admin@example.com');
    console.log('Password: admin123');
    console.log('\nYou can now login with these credentials.');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
};

createAdmin();
