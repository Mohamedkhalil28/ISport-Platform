const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

let users = [
  { id: 1, name: 'khalil', email: 'khalil@isport.com', password: '123456' },
  { id: 2, name: 'Louay', email: 'louay@isport.com', password: '123456' },
  { id: 3, name: 'Malek', email: 'malek@isport.com', password: '123456' },
  { id: 4, name: 'karim', email: 'karim@isport.com', password: '123456' },
  { id: 5, name: 'Rami', email: 'rami@isport.com', password: '123456' }
];

let currentUser = null;

app.post('/api/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: "Tous les champs sont requis" });

  if (users.find(u => u.email === email))
    return res.status(400).json({ message: "Email déjà utilisé" });

  const newUser = { id: users.length + 1, name, email, password };
  users.push(newUser);
  res.json({ message: "Compte créé avec succès", user: newUser });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ message: "Identifiants invalides" });
  currentUser = user;
  res.json({ message: "Connexion réussie", user });
});

app.get('/api/profile', (req, res) => {
  if (!currentUser)
    return res.status(401).json({ message: "Non connecté" });
  res.json({ user: currentUser });
});

app.post('/api/logout', (req, res) => {
  currentUser = null;
  res.json({ message: "Déconnexion réussie" });
});

app.get('/api/admin/users', (req, res) => {
  res.json(users.map(u => ({ id: u.id, name: u.name, email: u.email })));
});

app.delete('/api/admin/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  users = users.filter(u => u.id !== id);
  res.json({ message: "Utilisateur supprimé" });
});

app.listen(5000, () => console.log("🚀 Backend iSport prêt sur http://localhost:5000"));
