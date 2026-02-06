// server.js
require('dotenv').config();

const app = require('./src/app');
const connectDB = require('./src/config/db');
require('./src/models');

const PORT = process.env.PORT || 5000;

// Start the server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🌐 Accessible on local network via http://10.10.20.34:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();