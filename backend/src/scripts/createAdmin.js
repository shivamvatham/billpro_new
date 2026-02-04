require('dotenv').config();
const bcrypt = require('bcryptjs');
const Tenant = require('../models/Tenant.model');
const User = require('../models/User.model');
const connectDB = require('../config/db');

const createTestTenant = async () => {
  try {
    await connectDB();


    // Create new tenant
    const tenant = await Tenant.create({
      name: 'admin tenant',
      slug: 'admin-tenant'
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin', salt);

    // Create admin for this tenant
    const user = await User.create({
      name: 'admin',
      username: 'admin',
      email: 'admin@gmail.com',
      password: hashedPassword,
      role: 'admin',
      tenant: tenant._id
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating test tenant:', error.message);
    process.exit(1);
  }
};

createTestTenant();