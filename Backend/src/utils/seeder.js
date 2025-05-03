const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables
dotenv.config();

// Import models
const User = require('../models/User');
const Service = require('../models/Service');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Booking = require('../models/Booking');
const Order = require('../models/Order');
const Review = require('../models/Review');

// Connect to DB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/locallink', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Read JSON files
const users = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../data/users.json'), 'utf-8')
);

const categories = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../data/categories.json'), 'utf-8')
);

const services = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../data/services.json'), 'utf-8')
);

const products = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../data/products.json'), 'utf-8')
);

// Import data into DB
const importData = async () => {
  try {
    // Clear any existing data
    await User.deleteMany();
    await Category.deleteMany();
    await Service.deleteMany();
    await Product.deleteMany();
    await Booking.deleteMany();
    await Order.deleteMany();
    await Review.deleteMany();

    // Insert users first to get IDs
    const createdUsers = await User.insertMany(users);
    
    // Get admin user ID and providers for reference
    const adminUserId = createdUsers.find(user => user.role === 'admin')._id;
    const providerUsers = createdUsers.filter(user => user.role === 'provider');
    
    // Insert categories
    const createdCategories = await Category.insertMany(categories);
    
    // Map category names to IDs for easier reference
    const categoryMap = createdCategories.reduce((map, category) => {
      map[category.name.toLowerCase()] = category._id;
      return map;
    }, {});
    
    // Prepare services with provider references
    const servicesWithProviders = services.map((service, index) => {
      // Distribute services evenly among providers
      const provider = providerUsers[index % providerUsers.length];
      
      // Map category strings to category IDs
      const categoryIds = service.categories.map(
        catName => categoryMap[catName.toLowerCase()]
      );
      
      return {
        ...service,
        providerId: provider._id,
        categories: categoryIds
      };
    });
    
    // Insert services
    await Service.insertMany(servicesWithProviders);
    
    // Prepare products with category references
    const productsWithCategories = products.map((product) => {
      // Map category strings to category IDs
      const categoryIds = product.categories.map(
        catName => categoryMap[catName.toLowerCase()]
      );
      
      return {
        ...product,
        categories: categoryIds
      };
    });
    
    // Insert products
    await Product.insertMany(productsWithCategories);

    console.log('Data imported successfully');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Delete all data from DB
const deleteData = async () => {
  try {
    await User.deleteMany();
    await Category.deleteMany();
    await Service.deleteMany();
    await Product.deleteMany();
    await Booking.deleteMany();
    await Order.deleteMany();
    await Review.deleteMany();

    console.log('Data destroyed successfully');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Check command line arguments to determine action
if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
} else {
  console.log('Please use correct flag: -i (import) or -d (delete)');
  process.exit();
} 