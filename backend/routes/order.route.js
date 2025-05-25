import express from 'express';
import Order from '../models/order.model.js';

const router = express.Router();

// Create a new order
router.post('/', async (req, res) => {
  try {
    const { name, address, productId } = req.body;
    const newOrder = new Order({ name, address, productId });
    await newOrder.save();
    res.status(201).json({ success: true, message: 'Order placed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to place order' });
  }
});

export default router;
