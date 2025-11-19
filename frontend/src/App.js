import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

axios.defaults.baseURL = "http://localhost:5000/api";
axios.defaults.withCredentials = true;

const regionsTN = [
  "Tunis","Ariana","Ben Arous","La Manouba","Nabeul","Zaghouan","Bizerte",
  "Béja","Jendouba","Le Kef","Siliana","Sousse","Monastir","Mahdia",
  "Kairouan","Kasserine","Sidi Bouzid","Gabès","Médenine","Tataouine",
  "Gafsa","Tozeur","Kébili","Sfax"
];

function App() {
  const [page, setPage] = useState("connexion");
  const [user, setUser] = useState(null);

  // Charger l’utilisateur si un refresh
  useEffect(() => {
    axios.get("/profile")
      .then(res => {
        setUser(res.data.user);
        if (res.data.user.role === "admin") setPage("admin");
        else setPage("profil");
      })
      .catch(() => setUser(null));
  }, []);

  const logout = async () => {
    await axios.post("/logout");
    setUser(null);
    setPage("connexion");
  };

  return (
    <div className="App">
      
      {/* SIDEBAR */}
      <div className="sidebar">
        <h1>iSport Admin</h1>

        {!user && (
          <>
            <button onClick={() => setPage("inscription")}>📝 Inscription</button>
            <button onClick={() => setPage("connexion")}>🔐 Connexion</button>
          </>
        )}

        {user && (
          <>
            <button 
              onClick={() => setPage("profil")}
              className={page === "profil" ? "active" : ""}
            >
              👤 Profil
            </button>

            {/* ADMIN ONLY */}
            {user.role === "admin" && (
              <button 
                onClick={() => setPage("admin")}
                className={page === "admin" ? "active" : ""}
              >
                ⚙️ Dashboard Admin
              </button>
            )}
          </>
        )}
      </div>


      {/* MAIN */}
      <div className="main">

        {/* TOPBAR */}
        <div className="topbar">
          <span className="title">
            {page === "admin" ? "Tableau de bord • iSport" : "iSport Platform"}
          </span>

          {user && (
            <div className="userinfo">
              Bonjour, <b>{user.name}</b> ({user.role})
              <button className="logout-btn" onClick={logout}>Déconnexion</button>
            </div>
          )}
        </div>


        {/* CONTENT */}
        <div className="content">
          {page === "inscription" && <RegisterPage />}
          {page === "connexion" && <LoginPage onLogin={setUser} onChangePage={setPage} />}
          {page === "profil" && user && <ProfilePage user={user} setUser={setUser} />}
          {page === "admin" && user?.role === "admin" && <AdminPage />}
        </div>

      </div>
    </div>
  );
}






/* ---------------------------------------------------------
   INSCRIPTION
--------------------------------------------------------- */
function RegisterPage() {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    region: "",
    birthDate: ""
  });

  const submit = async e => {
    e.preventDefault();

    try {
      await axios.post("/register", data);
      alert("Compte créé avec succès !");
      setData({
        name: "",
        email: "",
        password: "",
        phone: "",
        region: "",
        birthDate: ""
      });
    } catch (e) {
      alert(e.response?.data?.message || "Erreur inscription");
    }
  };

  return (
    <div className="page">
      <h2>📝 Créer un compte</h2>
      <form onSubmit={submit}>

        <input placeholder="Nom complet"
          value={data.name}
          onChange={e => setData({ ...data, name: e.target.value })}
        />

        <input placeholder="Email"
          value={data.email}
          onChange={e => setData({ ...data, email: e.target.value })}
        />

        <input type="password" placeholder="Mot de passe"
          value={data.password}
          onChange={e => setData({ ...data, password: e.target.value })}
        />

        <input placeholder="Téléphone"
          value={data.phone}
          onChange={e => setData({ ...data, phone: e.target.value })}
        />

        <select
          value={data.region}
          onChange={e => setData({ ...data, region: e.target.value })}
        >
          <option value="">-- Choisir région --</option>
          {regionsTN.map(r => <option key={r}>{r}</option>)}
        </select>

        <input type="date"
          value={data.birthDate}
          onChange={e => setData({ ...data, birthDate: e.target.value })}
        />

        <button className="btn-primary" type="submit">Créer mon compte</button>
      </form>
    </div>
  );
}





/* ---------------------------------------------------------
   CONNEXION
--------------------------------------------------------- */
function LoginPage({ onLogin, onChangePage }) {
  const [cred, setCred] = useState({ email: "", password: "" });

  const login = async () => {
    try {
      const res = await axios.post("/login", cred);
      alert("Connexion réussie !");
      onLogin(res.data.user);

      // Redirect auto
      if (res.data.user.role === "admin") onChangePage("admin");
      else onChangePage("profil");

    } catch (e) {
      alert(e.response?.data?.message || "Erreur connexion");
    }
  };

  return (
    <div className="page">
      <h2>🔐 Connexion</h2>

      <input placeholder="Email"
        onChange={e => setCred({ ...cred, email: e.target.value })}
      />

      <input type="password" placeholder="Mot de passe"
        onChange={e => setCred({ ...cred, password: e.target.value })}
      />

      <button className="btn-primary" onClick={login}>Se connecter</button>
    </div>
  );
}





/* ---------------------------------------------------------
   PROFIL (MODIFIABLE)
--------------------------------------------------------- */
function ProfilePage({ user, setUser }) {

  const [form, setForm] = useState({
    name: user.name,
    phone: user.phone,
    region: user.region,
    birthDate: user.birthDate?.substring(0,10)
  });

  const update = async () => {
    try {
      const res = await axios.put("/profile/update", form);
      alert("Profil mis à jour !");
      setUser(res.data.user);
    } catch (e) {
      alert("Erreur : " + JSON.stringify(e.response?.data));
    }
  };

  return (
    <div className="page">
      <h2>Mon Profil</h2>

      <form>

        <input
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />

        <input
          value={user.email}
          disabled
        />

        <input
          value={form.phone}
          onChange={e => setForm({ ...form, phone: e.target.value })}
        />

        <select
          value={form.region}
          onChange={e => setForm({ ...form, region: e.target.value })}
        >
          {regionsTN.map(r => <option key={r}>{r}</option>)}
        </select>

        <input type="date"
          value={form.birthDate}
          onChange={e => setForm({ ...form, birthDate: e.target.value })}
        />

        <div style={{ display: "flex", gap: "15px" }}>
          <button type="button" className="btn-primary" onClick={update}>
            Enregistrer
          </button>
          <button type="button" className="btn-danger" onClick={() => window.location.reload()}>
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}





/* ---------------------------------------------------------
   ADMIN DASHBOARD
--------------------------------------------------------- */
function AdminPage() {
  const [users, setUsers] = useState([]);

  const load = async () => {
    const res = await axios.get("/admin/users");
    setUsers(res.data);
  };

  useEffect(() => { load(); }, []);

  const del = async (id) => {
    if (!window.confirm("Supprimer cet utilisateur ?")) return;

    await axios.delete(`/admin/users/${id}`);
    load();
  };

  return (
    <div className="page">
      <h2>⚙️ Gestion des utilisateurs</h2>

      <p>Total : {users.length}</p>

      {users.map(u => (
        <div className="user-card" key={u._id}>
          <span>
            {u.name} — {u.email} — {u.region}
          </span>
          <button className="btn-danger" onClick={() => del(u._id)}>🗑️</button>
        </div>
      ))}
    </div>
  );
}

export default App;
