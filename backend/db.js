const mongoose = require('mongoose');
const uri = process.env.MONGO_URI;

async function connectDB() {
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  console.log('✅ MongoDB connecté');
}

module.exports = connectDB;
