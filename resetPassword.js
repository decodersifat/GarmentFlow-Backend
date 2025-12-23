const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

dotenv.config();

const resetPasswords = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const hashedPassword = await bcrypt.hash('password123', 10);

        // Update Admin
        const admin = await User.findOneAndUpdate(
            { email: 'admin@example.com' },
            { password: hashedPassword },
            { new: true }
        );
        if (admin) console.log('Admin password updated');
        else console.log('Admin not found');

        // Update Manager
        const manager = await User.findOneAndUpdate(
            { email: 'manager@example.com' },
            { password: hashedPassword },
            { new: true }
        );
        if (manager) console.log('Manager password updated');
        else console.log('Manager not found');

        // Update Buyer
        const buyer = await User.findOneAndUpdate(
            { email: 'buyer@example.com' },
            { password: hashedPassword },
            { new: true }
        );
        if (buyer) console.log('Buyer password updated');
        else console.log('Buyer not found');

        process.exit(0);
    } catch (error) {
        console.error('Error resetting passwords:', error);
        process.exit(1);
    }
};

resetPasswords();
