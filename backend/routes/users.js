const express = require('express');
const { ObjectId } = require('mongodb');
const { getDB } = require('../config/database');
const router = express.Router();

// Get all users - Your original endpoint
router.get('/', async (req, res) => {
  const collection = getDB().collection('user');
  try {
    const users = await collection.find({}).toArray();
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Database error' });
  }
});

// Create new user - Your original endpoint
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const collection = getDB().collection('user');
    const newUser = { 
      id: data.id,
      name: data.name, 
      email: data.email, 
      age: parseInt(data.age), 
      profession: data.profession, 
      summary: data.summary 
    };
    const result = await collection.insertOne(newUser);
    newUser._id = result.insertedId;
    
    res.json({ success: true, data: newUser });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Invalid JSON or Database error' });
  }
});

// Get single user - Your original endpoint
router.get('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const collection = getDB().collection('user');
    const user = await collection.findOne({ _id: new ObjectId(userId) });
    
    if (user) {
      res.json({ success: true, data: user });
    } else {
      res.json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Database error' });
  }
});

// Update user - Your original endpoint
router.put('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const data = req.body;
    const collection = getDB().collection('user');
    
    const updatedUser = {
      id: data.id,
      name: data.name,
      email: data.email,
      age: parseInt(data.age),
      profession: data.profession,
      summary: data.summary
    };

    const result = await collection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: updatedUser }
    );

    if (result.matchedCount > 0) {
      updatedUser._id = new ObjectId(userId);
      res.json({ success: true, data: updatedUser });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: 'Invalid JSON or Database error' });
  }
});

// Delete user - Your original endpoint
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const collection = getDB().collection('user');
    
    const result = await collection.deleteOne({ _id: new ObjectId(userId) });
    
    if (result.deletedCount > 0) {
      res.json({ success: true, message: 'User deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Database error' });
  }
});

module.exports = router;