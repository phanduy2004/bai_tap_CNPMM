const mongoose = require('mongoose');
const User = require('./models/user');
const Category = require('./models/Category');
const Product = require('./models/Product');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/express01', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const seedDB = async () => {
  // Clear existing data
  await User.deleteMany({});
  await Category.deleteMany({});
  await Product.deleteMany({});

  // Create categories
  const categories = await Category.insertMany([
    { name: 'Laptops', description: 'Various laptop models' },
    { name: 'Desktops', description: 'Powerful desktop computers' },
    { name: 'Accessories', description: 'Computer accessories' }
  ]);

  // Create users
  await User.insertMany([
    { name: 'Admin User', email: 'admin@example.com', password: 'admin123', role: 'admin' },
    { name: 'John Doe', email: 'john@example.com', password: 'john123', role: 'user' },
    { name: 'Jane Smith', email: 'jane@example.com', password: 'jane123', role: 'user' }
  ]);

  // Create products (3 cũ + 15 mới = 18)
  await Product.insertMany([
    // ==== Existing 3 ====
    {
      name: 'MacBook Pro 16"',
      category: categories[0]._id,
      brand: 'Apple',
      cpu: 'M2 Pro',
      ram: '16GB',
      storage: '1TB SSD',
      gpu: 'M2 Pro 19-core',
      screen: '16.2-inch Liquid Retina XDR',
      price: 2499,
      quantity: 10,
      description: 'Powerful laptop for professionals',
      imageUrl: 'https://example.com/macbook-pro.jpg'
    },
    {
      name: 'Dell XPS 15',
      category: categories[0]._id,
      brand: 'Dell',
      cpu: 'Intel Core i7',
      ram: '32GB',
      storage: '1TB SSD',
      gpu: 'NVIDIA RTX 3050 Ti',
      screen: '15.6-inch 4K UHD',
      price: 1999,
      quantity: 15,
      description: 'Premium Windows laptop',
      imageUrl: 'https://example.com/dell-xps.jpg'
    },
    {
      name: 'Alienware Aurora R15',
      category: categories[1]._id,
      brand: 'Dell',
      cpu: 'Intel Core i9',
      ram: '64GB',
      storage: '2TB SSD + 2TB HDD',
      gpu: 'NVIDIA RTX 4090',
      price: 3499,
      quantity: 5,
      description: 'High-performance gaming desktop',
      imageUrl: 'https://example.com/alienware.jpg'
    },

    // ==== +15 NEW ====

    // Laptops
    {
      name: 'Lenovo ThinkPad X1 Carbon Gen 11',
      category: categories[0]._id,
      brand: 'Lenovo',
      cpu: 'Intel Core i7-1365U',
      ram: '16GB',
      storage: '512GB SSD',
      gpu: 'Intel Iris Xe',
      screen: '14-inch 2.8K OLED',
      price: 1899,
      quantity: 20,
      description: 'Ultralight business laptop with premium keyboard',
      imageUrl: 'https://example.com/thinkpad-x1-carbon.jpg'
    },
    {
      name: 'ASUS ROG Zephyrus G14',
      category: categories[0]._id,
      brand: 'ASUS',
      cpu: 'AMD Ryzen 9 7940HS',
      ram: '32GB',
      storage: '1TB SSD',
      gpu: 'NVIDIA RTX 4070',
      screen: '14-inch QHD+ 165Hz',
      price: 2199,
      quantity: 12,
      description: 'Compact gaming laptop with excellent thermals',
      imageUrl: 'https://example.com/rog-g14.jpg'
    },
    {
      name: 'HP Spectre x360 14',
      category: categories[0]._id,
      brand: 'HP',
      cpu: 'Intel Core Ultra 7',
      ram: '16GB',
      storage: '1TB SSD',
      gpu: 'Intel Arc iGPU',
      screen: '13.5-inch 3K2K OLED',
      price: 1699,
      quantity: 18,
      description: 'Convertible ultrabook with OLED touch display',
      imageUrl: 'https://example.com/spectre-x360-14.jpg'
    },
    {
      name: 'MacBook Air 13" (M3)',
      category: categories[0]._id,
      brand: 'Apple',
      cpu: 'Apple M3',
      ram: '8GB',
      storage: '256GB SSD',
      gpu: 'Apple M3 integrated',
      screen: '13.6-inch Liquid Retina',
      price: 1199,
      quantity: 25,
      description: 'Thin and light with long battery life',
      imageUrl: 'https://example.com/macbook-air-m3.jpg'
    },
    {
      name: 'Microsoft Surface Laptop 5 15"',
      category: categories[0]._id,
      brand: 'Microsoft',
      cpu: 'Intel Core i7-1265U',
      ram: '16GB',
      storage: '512GB SSD',
      gpu: 'Intel Iris Xe',
      screen: '15-inch 2496x1664 PixelSense',
      price: 1799,
      quantity: 14,
      description: 'Elegant design and great typing experience',
      imageUrl: 'https://example.com/surface-laptop-5.jpg'
    },
    {
      name: 'MSI Creator Z16',
      category: categories[0]._id,
      brand: 'MSI',
      cpu: 'Intel Core i9-12900H',
      ram: '32GB',
      storage: '1TB SSD',
      gpu: 'NVIDIA RTX 3060',
      screen: '16-inch QHD+ 120Hz',
      price: 2399,
      quantity: 8,
      description: 'Creator-focused laptop with color-accurate display',
      imageUrl: 'https://example.com/msi-creator-z16.jpg'
    },
    {
      name: 'Acer Swift 3',
      category: categories[0]._id,
      brand: 'Acer',
      cpu: 'Intel Core i5-1335U',
      ram: '8GB',
      storage: '512GB SSD',
      gpu: 'Intel Iris Xe',
      screen: '14-inch FHD IPS',
      price: 799,
      quantity: 30,
      description: 'Great value thin-and-light laptop',
      imageUrl: 'https://example.com/acer-swift-3.jpg'
    },
    {
      name: 'Gigabyte Aero 16 OLED',
      category: categories[0]._id,
      brand: 'Gigabyte',
      cpu: 'Intel Core i7-13700H',
      ram: '32GB',
      storage: '1TB SSD',
      gpu: 'NVIDIA RTX 4070',
      screen: '16-inch 4K OLED',
      price: 2599,
      quantity: 7,
      description: 'Creator laptop with stunning OLED display',
      imageUrl: 'https://example.com/aero-16-oled.jpg'
    },

    // Desktops
    {
      name: 'HP Omen 45L',
      category: categories[1]._id,
      brand: 'HP',
      cpu: 'Intel Core i9-14900K',
      ram: '64GB',
      storage: '2TB SSD',
      gpu: 'NVIDIA RTX 4080 Super',
      screen: '',
      price: 3299,
      quantity: 6,
      description: 'Enthusiast gaming desktop with liquid cooling',
      imageUrl: 'https://example.com/omen-45l.jpg'
    },
    {
      name: 'Apple Mac Studio (M2 Max)',
      category: categories[1]._id,
      brand: 'Apple',
      cpu: 'Apple M2 Max',
      ram: '32GB',
      storage: '1TB SSD',
      gpu: 'Apple M2 Max integrated',
      screen: '',
      price: 1999,
      quantity: 10,
      description: 'Compact powerhouse for creatives',
      imageUrl: 'https://example.com/mac-studio-m2-max.jpg'
    },
    {
      name: 'Intel NUC 13 Pro',
      category: categories[1]._id,
      brand: 'Intel',
      cpu: 'Intel Core i7-1360P',
      ram: '16GB',
      storage: '512GB SSD',
      gpu: 'Intel Iris Xe',
      screen: '',
      price: 999,
      quantity: 20,
      description: 'Tiny form factor desktop for office and home',
      imageUrl: 'https://example.com/intel-nuc-13-pro.jpg'
    },
    {
      name: 'Lenovo Legion Tower 7i',
      category: categories[1]._id,
      brand: 'Lenovo',
      cpu: 'Intel Core i9-13900KF',
      ram: '32GB',
      storage: '1TB SSD + 2TB HDD',
      gpu: 'NVIDIA RTX 4080',
      screen: '',
      price: 2899,
      quantity: 9,
      description: 'High-end gaming desktop with RGB chassis',
      imageUrl: 'https://example.com/legion-tower-7i.jpg'
    },

    // Accessories
    {
      name: 'Logitech MX Master 3S',
      category: categories[2]._id,
      brand: 'Logitech',
      cpu: '',
      ram: '',
      storage: '',
      gpu: '',
      screen: '',
      price: 99,
      quantity: 50,
      description: 'Ergonomic wireless mouse for productivity',
      imageUrl: 'https://example.com/mx-master-3s.jpg'
    },
    {
      name: 'Keychron K2 V2',
      category: categories[2]._id,
      brand: 'Keychron',
      cpu: '',
      ram: '',
      storage: '',
      gpu: '',
      screen: '',
      price: 89,
      quantity: 40,
      description: 'Compact 75% mechanical keyboard (hot-swappable)',
      imageUrl: 'https://example.com/keychron-k2.jpg'
    },
    {
      name: 'Samsung T7 Portable SSD 1TB',
      category: categories[2]._id,
      brand: 'Samsung',
      cpu: '',
      ram: '',
      storage: '1TB SSD (external)',
      gpu: '',
      screen: '',
      price: 129,
      quantity: 60,
      description: 'Portable USB-C SSD with fast transfer speeds',
      imageUrl: 'https://example.com/samsung-t7-1tb.jpg'
    }
  ]);

  console.log('Database seeded!');
  mongoose.connection.close();
};

seedDB().catch(err => {
  console.error('Error seeding database:', err);
  mongoose.connection.close();
});
