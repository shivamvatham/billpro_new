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
      name: 'tenant 2',
      slug: 'tenant-2'
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('tenant2', salt);

    // Create admin for this tenant
    const user = await User.create({
      name: 'tenant 2',
      email: 'tenant@2.com',
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