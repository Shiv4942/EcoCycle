const express = require('express');
const QRCode = require('qrcode');
const PickupRequest = require('../models/PickupRequest');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Create pickup request
router.post('/', auth, async (req, res) => {
  try {
    const {
      deviceType,
      deviceDescription,
      quantity,
      address,
      preferredPickupDate,
      preferredTimeSlot,
      notes
    } = req.body;

    const pickupRequest = new PickupRequest({
      user: req.user._id,
      deviceType,
      deviceDescription,
      quantity,
      address,
      preferredPickupDate,
      preferredTimeSlot,
      notes
    });

    await pickupRequest.save();

    // Generate QR code
    const qrCodeDataURL = await QRCode.toDataURL(pickupRequest.qrCode);

    res.status(201).json({
      message: 'Pickup request created successfully',
      pickupRequest,
      qrCode: qrCodeDataURL
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's pickup requests
router.get('/my-pickups', auth, async (req, res) => {
  try {
    const pickups = await PickupRequest.find({ user: req.user._id })
      .populate('assignedTo', 'name email phone')
      .sort({ createdAt: -1 });

    res.json(pickups);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all pickup requests (for admin/ngo)
router.get('/', auth, authorize('admin', 'ngo'), async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const filter = {};
    if (status) filter.status = status;

    const pickups = await PickupRequest.find(filter)
      .populate('user', 'name email phone')
      .populate('assignedTo', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await PickupRequest.countDocuments(filter);

    res.json({
      pickups,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get recent pickup requests (for admin dashboard)
router.get('/recent', auth, authorize('admin'), async (req, res) => {
  try {
    const pickups = await PickupRequest.find()
      .populate('user', 'name email phone')
      .populate('assignedTo', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({ pickups });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get pickup request by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const pickup = await PickupRequest.findById(req.params.id)
      .populate('user', 'name email phone address')
      .populate('assignedTo', 'name email phone');

    if (!pickup) {
      return res.status(404).json({ message: 'Pickup request not found' });
    }

    // Check if user has permission to view this pickup
    if (req.user.role === 'user' && pickup.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(pickup);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update pickup status (for admin/ngo)
router.patch('/:id/status', auth, authorize('admin', 'ngo'), async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    const pickup = await PickupRequest.findById(req.params.id);
    if (!pickup) {
      return res.status(404).json({ message: 'Pickup request not found' });
    }

    pickup.status = status;
    if (notes) pickup.notes = notes;

    // Set dates based on status
    if (status === 'collected') {
      pickup.collectionDate = new Date();
    } else if (status === 'recycled') {
      pickup.recyclingDate = new Date();
    }

    await pickup.save();

    res.json({
      message: 'Pickup status updated successfully',
      pickup
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Assign pickup to NGO/recycler
router.patch('/:id/assign', auth, authorize('admin'), async (req, res) => {
  try {
    const { assignedTo } = req.body;
    
    const pickup = await PickupRequest.findById(req.params.id);
    if (!pickup) {
      return res.status(404).json({ message: 'Pickup request not found' });
    }

    pickup.assignedTo = assignedTo;
    pickup.status = 'assigned';

    await pickup.save();

    res.json({
      message: 'Pickup assigned successfully',
      pickup
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get QR code for pickup
router.get('/:id/qr', auth, async (req, res) => {
  try {
    const pickup = await PickupRequest.findById(req.params.id);
    if (!pickup) {
      return res.status(404).json({ message: 'Pickup request not found' });
    }

    // Check if user has permission
    if (req.user.role === 'user' && pickup.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const qrCodeDataURL = await QRCode.toDataURL(pickup.qrCode);

    res.json({
      qrCode: qrCodeDataURL,
      pickupId: pickup._id
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Scan QR code and get pickup info
router.post('/scan', auth, authorize('admin', 'ngo'), async (req, res) => {
  try {
    const { qrCode } = req.body;
    
    const pickup = await PickupRequest.findOne({ qrCode })
      .populate('user', 'name email phone address')
      .populate('assignedTo', 'name email phone');

    if (!pickup) {
      return res.status(404).json({ message: 'Invalid QR code' });
    }

    // Update status to collected and set collection date
    pickup.status = 'collected';
    pickup.collectionDate = new Date();
    await pickup.save();

    res.json({
      message: 'QR code scanned successfully. Pickup marked as collected.',
      pickup
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router; 