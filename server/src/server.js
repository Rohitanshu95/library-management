import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and then start listening
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`[Server] College For Competitive Studies (C2S) API Server running at http://localhost:${PORT}`);
      console.log(`[Server] Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('[Server Start Failure]:', error);
    process.exit(1);
  }
};

startServer();
