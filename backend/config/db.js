import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/multimodal_ai';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[MongoDB Connection Warning] Could not connect to MongoDB at ${uri}`);
    console.error(`Error details: ${error.message}`);
    console.warn(`[MongoDB Note] Ensure MongoDB is running locally (e.g., mongod) or configure MONGODB_URI with a MongoDB Atlas cloud connection string in backend/.env.`);
    
    // In production and dev, log the error rather than hard exiting so the web server can still serve health checks
    console.warn(`[MongoDB Notice] Server started without active DB connection. Database operations will retry upon incoming requests.`);
  }
};

mongoose.connection.on('disconnected', () => {
  console.log('[MongoDB] Connection lost. Attempting to reconnect...');
});
