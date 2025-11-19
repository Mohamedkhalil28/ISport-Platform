const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/User");   // Assure-toi que le chemin est correct

const app = express();


// ------------------------------
// 🔌 Connexion MongoDB
// ------------------------------
mongoose.connect("mongodb://127.0.0.1:27017/iSportDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connecté"))
.catch(err => console.error("❌ Erreur MongoDB :", err));


// ------------------------------
// ⚙️ Middlewares
// ------------------------------
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());


// ------------------------------
// 🧠 Session simplifiée (variable)
// ⚠️ se réinitialise si backend redémarre
// ------------------------------
let currentUser = null;


// ------------------------------
// 🛡 Middleware Admin
// ------------------------------
function requireAdmin(req, res, next) {
  if (!currentUser || currentUser.role !== "admin") {
    return res.status(403).json({ message: "Accès réservé aux administrateurs" });
  }
  next();
}



// ------------------------------------------------------------
// 📝 REGISTER
// ------------------------------------------------------------
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password, phone, region, birthDate } = req.body;

    if (!name || !email || !password || !phone || !region || !birthDate) {
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email déjà utilisé" });
    }

    const newUser = await User.create({
      name,
      email,
      password,
      phone,
      region,
      birthDate,
      role: "user"
    });

    res.json({ message: "Compte créé avec succès", user: newUser });

  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});



// ------------------------------------------------------------
// 🔐 LOGIN
// ------------------------------------------------------------
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }

    currentUser = user;

    res.json({ message: "Connexion réussie", user });

  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});



// ------------------------------------------------------------
// 👤 GET PROFILE
// ------------------------------------------------------------
app.get("/api/profile", async (req, res) => {
  try {
    if (!currentUser) {
      return res.status(401).json({ message: "Non connecté" });
    }

    // Rafraîchir l’utilisateur depuis MongoDB (important)
    const fresh = await User.findById(currentUser._id);
    currentUser = fresh;

    res.json({ user: fresh });

  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});



// ------------------------------------------------------------
// ✏️ UPDATE PROFILE
// ------------------------------------------------------------
app.put("/api/profile/update", async (req, res) => {
  try {
    if (!currentUser) {
      return res.status(401).json({ message: "Non connecté" });
    }

    const { name, phone, region, birthDate } = req.body;

    const updated = await User.findByIdAndUpdate(
      currentUser._id,
      { name, phone, region, birthDate },
      { new: true }
    );

    currentUser = updated;

    res.json({ message: "Profil mis à jour", user: updated });

  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});



// ------------------------------------------------------------
// 🚪 LOGOUT
// ------------------------------------------------------------
app.post("/api/logout", (req, res) => {
  currentUser = null;
  res.json({ message: "Déconnexion réussie" });
});



// ------------------------------------------------------------
// ⚙️ ADMIN : LISTE DES USERS
// ------------------------------------------------------------
app.get("/api/admin/users", requireAdmin, async (req, res) => {
  try {
    const users = await User.find({}, {
      name: 1,
      email: 1,
      phone: 1,
      region: 1,
      birthDate: 1,
      role: 1
    });

    res.json(users);

  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});



// ------------------------------------------------------------
// 🗑 ADMIN : SUPPRESSION USER
// ------------------------------------------------------------
app.delete("/api/admin/users/:id", requireAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Utilisateur supprimé" });

  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});



// ------------------------------------------------------------
// 🚀 LANCEMENT SERVEUR
// ------------------------------------------------------------
app.listen(5000, () =>
  console.log("🚀 Backend iSport prêt sur http://localhost:5000")
);
