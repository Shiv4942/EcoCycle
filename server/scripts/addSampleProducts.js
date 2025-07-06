const mongoose = require('mongoose');
const Product = require('../models/Product');
const User = require('../models/User');
require('dotenv').config();

const sampleProducts = [
  {
    name: "MacBook Pro 2019",
    description: "Excellent condition MacBook Pro with 16GB RAM, 512GB SSD. Perfect for development and design work.",
    category: "Laptops",
    condition: "excellent",
    price: 45000,
    brand: "Apple",
    model: "MacBook Pro",
    age: 2,
    location: "Mumbai, Maharashtra",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500"
  },
  {
    name: "iPhone 12 Pro",
    description: "Good condition iPhone 12 Pro with 128GB storage. Includes original charger and case.",
    category: "Smartphones",
    condition: "good",
    price: 35000,
    brand: "Apple",
    model: "iPhone 12 Pro",
    age: 1,
    location: "Delhi, Delhi",
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500"
  },
  {
    name: "Dell XPS 13",
    description: "Fair condition Dell XPS 13 laptop. Great for office work and light gaming.",
    category: "Laptops",
    condition: "fair",
    price: 25000,
    brand: "Dell",
    model: "XPS 13",
    age: 3,
    location: "Bangalore, Karnataka",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500"
  },
  {
    name: "Samsung Galaxy Tab S7",
    description: "Excellent condition Samsung tablet with S Pen. Perfect for note-taking and media consumption.",
    category: "Tablets",
    condition: "excellent",
    price: 28000,
    brand: "Samsung",
    model: "Galaxy Tab S7",
    age: 1,
    location: "Chennai, Tamil Nadu",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500"
  },
  {
    name: "Logitech MX Master 3",
    description: "Good condition wireless mouse. Premium ergonomic design with precision scrolling.",
    category: "Mice",
    condition: "good",
    price: 3500,
    brand: "Logitech",
    model: "MX Master 3",
    age: 1,
    location: "Pune, Maharashtra",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500"
  }
];

const addSampleProducts = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get a user to assign as seller (use the first user found)
    const user = await User.findOne();
    if (!user) {
      console.log('No users found. Please create a user first.');
      return;
    }

    console.log(`Using user: ${user.name} (${user.email}) as seller`);

    // Add sample products
    for (const productData of sampleProducts) {
      // Transform location string to object
      const locationParts = productData.location.split(', ');
      const locationObj = {
        city: locationParts[0] || '',
        state: locationParts[1] || ''
      };

      // Transform age to year
      const currentYear = new Date().getFullYear();
      const year = productData.age ? currentYear - parseInt(productData.age) : currentYear;

      // Handle images array
      const images = productData.image ? [productData.image] : [];

      const product = new Product({
        seller: user._id,
        name: productData.name,
        description: productData.description,
        category: productData.category,
        condition: productData.condition,
        price: productData.price,
        brand: productData.brand,
        model: productData.model,
        year: year,
        location: locationObj,
        locationString: productData.location,
        images: images,
        image: productData.image,
        status: 'available'
      });

      await product.save();
      console.log(`✅ Added product: ${productData.name}`);
    }

    console.log('\n🎉 Sample products added successfully!');
    console.log(`Total products added: ${sampleProducts.length}`);

  } catch (error) {
    console.error('Error adding sample products:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the script
addSampleProducts(); 