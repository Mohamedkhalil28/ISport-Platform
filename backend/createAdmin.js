const connectDB = require("./config/db");
const User = require("./models/User");

async function createAdmin() {
  await connectDB();

  const admin = await User.create({
    name: "Admin",
    email: "admin@isport.com",
    password: "123456",
    role: "admin"
  });

  console.log("⭐ Admin créé :", admin);
  process.exit();
}

createAdmin();
