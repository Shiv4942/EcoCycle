const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

const updateProductStatus = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Update all existing products to have status 'available'
    const result = await Product.updateMany(
      { status: { $exists: false } },
      { $set: { status: 'available' } }
    );

    console.log(`Updated ${result.modifiedCount} products with status 'available'`);
    
    // Also update isAvailable field to match status
    const result2 = await Product.updateMany(
      { isAvailable: false },
      { $set: { status: 'sold' } }
    );

    console.log(`Updated ${result2.modifiedCount} unavailable products with status 'sold'`);

    console.log('Product status update completed successfully');
  } catch (error) {
    console.error('Error updating product status:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the script
updateProductStatus(); 