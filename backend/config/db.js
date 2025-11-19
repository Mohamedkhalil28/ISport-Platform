const mongoose = require('mongoose');

async function connectDB() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/iSportDB", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connecté !");
  } catch (err) {
    console.error("❌ Erreur de connexion MongoDB :", err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
