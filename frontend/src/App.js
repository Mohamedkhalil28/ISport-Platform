import React, { useState, useEffect } from "react";
import axios from "axios";
import './App.css';

axios.defaults.baseURL = "http://localhost:5000/api";

function App() {
  const [page, setPage] = useState("inscription");
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get("/profile").then(res => setUser(res.data.user)).catch(() => setUser(null));
  }, []);

  const logout = async () => {
    await axios.post("/logout");
    setUser(null);
    setPage("connexion");
  };

  return (
    <div className="App">
      <nav className="navbar">
        <div>
          <button onClick={() => setPage("inscription")}>📝 Inscription</button>
          <button onClick={() => setPage("connexion")}>🔐 Connexion</button>
          <button onClick={() => setPage("profil")}>👤 Profil</button>
          {user?.type === "admin" && <button onClick={() => setPage("admin")}>⚙️ Admin</button>}
        </div>
        {user && (
          <div className="user-info-nav">
            <span>👋 Bonjour, {user.name}</span>
            <button className="logout-btn" onClick={logout}>Déconnexion</button>
          </div>
        )}
      </nav>

      <div className="page-content">
        {page === "inscription" && <RegisterPage />}
        {page === "connexion" && <LoginPage onLogin={setUser} />}
        {page === "profil" && <ProfilePage user={user} onLogout={logout} />}
        {page === "admin" && user?.type === "admin" && <AdminPage />}
      </div>
    </div>
  );
}

// ----------------- Composants -------------------

function RegisterPage() {
  const [data, setData] = useState({ name: "", email: "", password: "", city: "" });
  const [loading, setLoading] = useState(false);

  const submit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("/register", data);
      alert(res.data.message);
      setData({ name: "", email: "", password: "", city: "" });
    } catch (e) {
      alert(e.response?.data?.message || "Erreur d'inscription");
    }
    setLoading(false);
  };

  return (
    <div className="page">
      <h2>📝 Créer un compte</h2>
      <form onSubmit={submit}>
        <input placeholder="Nom complet" value={data.name} onChange={e => setData({ ...data, name: e.target.value })} />
        <input placeholder="Email" value={data.email} onChange={e => setData({ ...data, email: e.target.value })} />
        <input type="password" placeholder="Mot de passe" value={data.password} onChange={e => setData({ ...data, password: e.target.value })} />
        <input placeholder="Ville" value={data.city} onChange={e => setData({ ...data, city: e.target.value })} />
        <button disabled={loading}>{loading ? "⏳ Création..." : "Créer mon compte"}</button>
      </form>
    </div>
  );
}

function LoginPage({ onLogin }) {
  const [cred, setCred] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const login = async () => {
    setLoading(true);
    try {
      const res = await axios.post("/login", cred);
      alert("Connexion réussie !");
      onLogin(res.data.user);
    } catch (e) {
      alert(e.response?.data?.message || "Erreur de connexion");
    }
    setLoading(false);
  };

  return (
    <div className="page">
      <h2>🔐 Connexion</h2>
      <input placeholder="Email" onChange={e => setCred({ ...cred, email: e.target.value })} />
      <input type="password" placeholder="Mot de passe" onChange={e => setCred({ ...cred, password: e.target.value })} />
      <button onClick={login} disabled={loading}>{loading ? "⏳ ..." : "Se connecter"}</button>
    </div>
  );
}

function ProfilePage({ user, onLogout }) {
  const [data, setData] = useState({ name: user?.name || "", city: user?.city || "", password: "" });
  const [loading, setLoading] = useState(false);

  const save = async () => {
    setLoading(true);
    try {
      const res = await axios.put("/profile", data);
      alert(res.data.message);
    } catch (e) {
      alert(e.response?.data?.message || "Erreur mise à jour");
    }
    setLoading(false);
  };

  if (!user) return <div className="page"><p>Veuillez vous connecter</p></div>;

  return (
    <div className="page">
      <h2>👤 Profil</h2>
      <input value={data.name} onChange={e => setData({ ...data, name: e.target.value })} placeholder="Nom" />
      <input value={data.city} onChange={e => setData({ ...data, city: e.target.value })} placeholder="Ville" />
      <input type="password" value={data.password} onChange={e => setData({ ...data, password: e.target.value })} placeholder="Nouveau mot de passe" />
      <button onClick={save} disabled={loading}>{loading ? "⏳ ..." : "Enregistrer"}</button>
      <button className="logout-btn" onClick={onLogout}>Déconnexion</button>
    </div>
  );
}

function AdminPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/admin/users");
      setUsers(res.data);
    } catch {
      alert("Erreur de chargement");
    }
    setLoading(false);
  };

  const del = async (id) => {
    if (!window.confirm("Supprimer cet utilisateur ?")) return;
    await axios.delete(`/admin/users/${id}`);
    load();
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="page">
      <h2>⚙️ Administration</h2>
      <button onClick={load}>🔄 Actualiser</button>
      <p>Utilisateurs : {users.length}</p>
      {loading ? <p>Chargement...</p> : users.map(u => (
        <div key={u._id} className="user-card">
          <span>{u.name} - {u.email} - {u.city}</span>
          <button className="delete-btn" onClick={() => del(u._id)}>🗑️ Supprimer</button>
        </div>
      ))}
    </div>
  );
}

export default App;
