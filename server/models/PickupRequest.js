const mongoose = require('mongoose');

const pickupRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  deviceType: {
    type: String,
    required: true,
    enum: ['laptop', 'desktop', 'mobile', 'tablet', 'printer', 'monitor', 'keyboard', 'mouse', 'other']
  },
  deviceDescription: {
    type: String,
    required: true,
    trim: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  address: {
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    zipCode: {
      type: String,
      required: true
    },
    additionalInfo: String
  },
  preferredPickupDate: {
    type: Date,
    required: true
  },
  preferredTimeSlot: {
    type: String,
    enum: ['morning', 'afternoon', 'evening'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'assigned', 'collected', 'recycled', 'cancelled'],
    default: 'pending'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  qrCode: {
    type: String,
    unique: true
  },
  notes: {
    type: String,
    trim: true
  },
  collectionDate: {
    type: Date
  },
  recyclingDate: {
    type: Date
  }
}, {
  timestamps: true
});

// Generate QR code before saving
pickupRequestSchema.pre('save', async function(next) {
  if (!this.qrCode) {
    this.qrCode = `PICKUP_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  next();
});

module.exports = mongoose.model('PickupRequest', pickupRequestSchema); 