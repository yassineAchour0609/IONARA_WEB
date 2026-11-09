require('dotenv').config({ path: require('path').join(__dirname, '.env') });
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32 || process.env.JWT_SECRET.includes('your_jwt')) {
  console.error('Set JWT_SECRET to a random secret of at least 32 characters in backend/.env.');
  process.exit(1);
}
const connectDB = require('./config/db');
const app = require('./app');
const PORT = process.env.PORT || 5000;

function startServer() {
  app.listen(PORT, '127.0.0.1', () => console.log(`IONARA API ready on http://127.0.0.1:${PORT}`));
}

connectDB()
  .then(() => {
    console.log('MongoDB connected successfully.');
    startServer();
  })
  .catch((err) => {
    console.warn(`[WARN] MongoDB non disponible (${err.message}). Lancement de l'API en mode catalogue.`);
    startServer();
    const interval = setInterval(async () => {
      try {
        await connectDB();
        console.log('MongoDB connecte avec succes !');
        clearInterval(interval);
      } catch {}
    }, 15000);
    if (interval.unref) interval.unref();
  });
