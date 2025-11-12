import React, { useState } from "react";
import axios from "axios";

export default function RegisterPage() {
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
        <input placeholder="Nom complet" value={data.name} onChange={e => setData({ ...data, name: e.target.value })} required />
        <input placeholder="Email" type="email" value={data.email} onChange={e => setData({ ...data, email: e.target.value })} required />
        <input type="password" placeholder="Mot de passe" value={data.password} onChange={e => setData({ ...data, password: e.target.value })} required minLength={6} />
        <input placeholder="Ville" value={data.city} onChange={e => setData({ ...data, city: e.target.value })} />
        <button disabled={loading}>{loading ? "⏳ Création..." : "Créer mon compte"}</button>
      </form>
    </div>
  );
}
