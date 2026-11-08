const mongoose = require('mongoose');
mongoose.set('bufferCommands', false);
module.exports = () => mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ionara_shop', { serverSelectionTimeoutMS: 5000 });
