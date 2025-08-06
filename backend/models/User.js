const { ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');
const { getDB } = require('../config/database');

class User {
  constructor(userData) {
    this.id = userData.id;
    this.name = userData.name;
    this.email = userData.email;
    this.password = userData.password;
    this.age = userData.age;
    this.profession = userData.profession;
    this.summary = userData.summary;
    this.googleId = userData.googleId;
    this.avatar = userData.avatar;
    this.createdAt = userData.createdAt || new Date();
  }

  static getCollection() {
    return getDB().collection('users');
  }

  async save() {
    const collection = User.getCollection();
    const result = await collection.insertOne(this);
    this._id = result.insertedId;
    return this;
  }

  static async findById(id) {
    const collection = User.getCollection();
    return await collection.findOne({ _id: new ObjectId(id) });
  }

  static async findByEmail(email) {
    const collection = User.getCollection();
    return await collection.findOne({ email });
  }

  static async findByGoogleId(googleId) {
    const collection = User.getCollection();
    return await collection.findOne({ googleId });
  }

  static async findAll() {
    const collection = User.getCollection();
    return await collection.find({}).toArray();
  }

  static async updateById(id, updateData) {
    const collection = User.getCollection();
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    return result;
  }

  static async deleteById(id) {
    const collection = User.getCollection();
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return result;
  }

  static async hashPassword(password) {
    return await bcrypt.hash(password, 12);
  }

  static async comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }
}

module.exports = User;