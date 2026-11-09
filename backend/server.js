require('dotenv').config({ path: require('path').join(__dirname, '.env') });
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32 || process.env.JWT_SECRET.includes('your_jwt')) {
  console.error('Set JWT_SECRET to a random secret of at least 32 characters in backend/.env.');
  process.exit(1);
}
const connectDB = require('./config/db');
const app = require('./app');
connectDB().then(() => app.listen(process.env.PORT || 5000, '127.0.0.1', () => console.log('IONARA API ready'))).catch(() => {
  console.error('MongoDB is unavailable. Start MongoDB or configure MONGODB_URI. No mock data was saved.');
  process.exit(1);
});
