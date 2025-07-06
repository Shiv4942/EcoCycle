const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.email);
      return;
    }

    // Create admin user
    const adminData = {
      name: 'System Administrator',
      email: 'admin@ecocycle.com',
      password: 'admin123456', // Change this to a secure password
      role: 'admin',
      phone: '+1234567890',
      organization: 'EcoCycle System',
      address: {
        street: '123 Admin Street',
        city: 'Admin City',
        state: 'AS',
        zipCode: '12345'
      },
      isActive: true
    };

    const admin = new User(adminData);
    await admin.save();

    console.log('Admin user created successfully:');
    console.log('Email:', admin.email);
    console.log('Password: admin123456');
    console.log('Role:', admin.role);
    console.log('\n⚠️  IMPORTANT: Change the password after first login!');

  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the script
createAdmin(); 