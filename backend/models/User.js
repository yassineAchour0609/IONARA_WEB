const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { randomBytes } = require('crypto');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Nom d'utilisateur requis"],
    trim: true,
    minlength: 3,
  },
  email: {
    type: String,
    required: [true, 'Adresse email requise'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Mot de passe requis'],
    minlength: 6,
  },
  phone: {
    type: String,
    default: '',
  },
  role: {
    type: String,
    enum: ['customer', 'admin'],
    default: 'customer',
  },
  loyaltyPoints: {
    type: Number,
    default: 25,
  },
  referralCode: {
    type: String,
    default: '',
  },
  referredBy: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre('save', async function (next) {
  if (!this.referralCode) {
    const prefix = (this.username || 'GAMER').replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 6) || 'GAMER';
    this.referralCode = `ION-${prefix}-${randomBytes(2).toString('hex').toUpperCase()}`;
  }
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
