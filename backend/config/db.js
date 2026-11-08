const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ionara_shop', {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB connecté avec succès : ${conn.connection.host}`);
  } catch (error) {
    console.warn(`⚠️ Avertissement MongoDB (${error.message}) : Le serveur fonctionne en mode autonome / mémoire.`);
  }
};

module.exports = connectDB;
