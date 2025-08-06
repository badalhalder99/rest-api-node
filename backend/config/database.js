const { MongoClient } = require('mongodb');
require('dotenv').config();

const URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const dbName = 'demo-database';

let db;

async function connectToMongoDB() {
  try {
    const client = new MongoClient(URI);
    await client.connect();
    console.log('Connected to MongoDB');
    db = client.db(dbName);
    return db;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}

function getDB() {
  if (!db) {
    throw new Error('Database not initialized. Call connectToMongoDB first.');
  }
  return db;
}

module.exports = { connectToMongoDB, getDB };