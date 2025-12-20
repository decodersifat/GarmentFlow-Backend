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
