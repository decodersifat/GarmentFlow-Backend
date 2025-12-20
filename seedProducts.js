const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const User = require('./models/User');

dotenv.config();

const products = [
    {
        name: 'Premium Denim Jacket',
        description: 'A classic denim jacket made from high-quality, durable denim. Features a comfortable fit and timeless design.',
        price: 89.99,
        category: 'Jacket',
        images: ['https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=800&h=800&fit=crop'],
        availableQuantity: 150,
        minimumOrderQuantity: 10,
        showOnHome: true
    },
    {
        name: 'Organic Cotton T-Shirt',
        description: 'Soft and breathable t-shirt made from 100% organic cotton. Perfect for everyday wear.',
        price: 24.99,
        category: 'Shirt',
        images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop'],
        availableQuantity: 500,
        minimumOrderQuantity: 50,
        showOnHome: true
    },
    {
        name: 'Slim Fit Chinos',
        description: 'Versatile chinos with a modern slim fit. Comfortable enough for the office and stylish enough for a night out.',
        price: 59.99,
        category: 'Pant',
        images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&h=800&fit=crop'],
        availableQuantity: 200,
        minimumOrderQuantity: 20,
        showOnHome: true
    },
    {
        name: 'Leather Biker Jacket',
        description: 'Authentic leather biker jacket with rugged details. A statement piece that gets better with age.',
        price: 199.99,
        category: 'Jacket',
        images: ['https://images.unsplash.com/photo-1551028919-ac7bcb7d7153?w=800&h=800&fit=crop'],
        availableQuantity: 50,
        minimumOrderQuantity: 5,
        showOnHome: true
    },
    {
        name: 'Formal Oxford Shirt',
        description: 'Crisp and professional Oxford shirt. Essential for any formal wardrobe.',
        price: 45.99,
        category: 'Shirt',
        images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&h=800&fit=crop'],
        availableQuantity: 300,
        minimumOrderQuantity: 20,
        showOnHome: true
    },
    {
        name: 'Classic Leather Belt',
        description: 'Handcrafted leather belt with a durable metal buckle. The perfect accessory for any outfit.',
        price: 29.99,
        category: 'Accessories',
        images: ['https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=800&h=800&fit=crop'],
        availableQuantity: 100,
        minimumOrderQuantity: 10,
        showOnHome: false
    },
    {
        name: 'Wool Blend Scarf',
        description: 'Warm and stylish wool blend scarf. Keeps you cozy during the colder months.',
        price: 34.99,
        category: 'Accessories',
        images: ['https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800&h=800&fit=crop'],
        availableQuantity: 150,
        minimumOrderQuantity: 15,
        showOnHome: false
    },
    {
        name: 'Cargo Pants',
        description: 'Durable cargo pants with multiple pockets. Practical and stylish for outdoor activities.',
        price: 54.99,
        category: 'Pant',
        images: ['https://images.unsplash.com/photo-1517445312882-566334360955?w=800&h=800&fit=crop'],
        availableQuantity: 120,
        minimumOrderQuantity: 10,
        showOnHome: false
    },
    {
        name: 'Summer Floral Dress',
        description: 'Lightweight and breezy floral dress. Perfect for summer days and beach vacations.',
        price: 49.99,
        category: 'Shirt', // Using Shirt category as general top/dress for now or add new category
        images: ['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&h=800&fit=crop'],
        availableQuantity: 80,
        minimumOrderQuantity: 5,
        showOnHome: true
    },
    {
        name: 'Winter Parka',
        description: 'Heavy-duty winter parka with faux fur hood. Provides ultimate protection against the cold.',
        price: 149.99,
        category: 'Jacket',
        images: ['https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&h=800&fit=crop'],
        availableQuantity: 60,
        minimumOrderQuantity: 5,
        showOnHome: false
    },
    {
        name: 'Silk Tie',
        description: 'Elegant silk tie for formal occasions. Adds a touch of sophistication to your suit.',
        price: 39.99,
        category: 'Accessories',
        images: ['https://images.unsplash.com/photo-1589756823695-278bc354634d?w=800&h=800&fit=crop'],
        availableQuantity: 200,
        minimumOrderQuantity: 20,
        showOnHome: false
    },
    {
        name: 'Denim Shorts',
        description: 'Casual denim shorts with a distressed look. A summer staple.',
        price: 34.99,
        category: 'Pant',
        images: ['https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&h=800&fit=crop'],
        availableQuantity: 180,
        minimumOrderQuantity: 15,
        showOnHome: false
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Find or create a manager user
        let manager = await User.findOne({ role: 'manager' });
        if (!manager) {
            console.log('No manager found. Creating a default manager...');
            manager = await User.create({
                name: 'Default Manager',
                email: 'manager@example.com',
                password: 'password123', // In a real app, this should be hashed
                role: 'manager',
                status: 'approved'
            });
        }

        // Find or create an admin user
        let admin = await User.findOne({ role: 'admin' });
        if (!admin) {
            console.log('No admin found. Creating a default admin...');
            admin = await User.create({
                name: 'Default Admin',
                email: 'admin@example.com',
                password: 'password123',
                role: 'admin',
                status: 'approved'
            });
        }

        // Find or create a buyer user
        let buyer = await User.findOne({ role: 'buyer' });
        if (!buyer) {
            console.log('No buyer found. Creating a default buyer...');
            buyer = await User.create({
                name: 'Default Buyer',
                email: 'buyer@example.com',
                password: 'password123',
                role: 'buyer',
                status: 'approved'
            });
        }

        await Product.deleteMany({});
        console.log('Cleared existing products');

        const productsWithUser = products.map(p => ({
            ...p,
            createdBy: manager._id
        }));

        await Product.insertMany(productsWithUser);
        console.log('Products seeded successfully');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDB();
