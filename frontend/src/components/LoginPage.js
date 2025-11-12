import React, { useState } from "react";
import axios from "axios";

export default function LoginPage({ onLogin }) {
  const [cred, setCred] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const login = async () => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/login", cred);
      const { token, user } = res.data;
      onLogin(user, token);
      alert("Connexion réussie !");
    } catch (e) {
      alert(e.response?.data?.message || "Erreur de connexion");
    }
    setLoading(false);
  };

  return (
    <div className="page">
      <h2>🔐 Connexion</h2>
      <input
        type="email"
        placeholder="Email"
        value={cred.email}
        onChange={(e) => setCred({ ...cred, email: e.target.value })}
        required
      />
      <input
        type="password"
        placeholder="Mot de passe"
        value={cred.password}
        onChange={(e) => setCred({ ...cred, password: e.target.value })}
        required
      />
      <button onClick={login} disabled={loading}>
        {loading ? "⏳ ..." : "Se connecter"}
      </button>
    </div>
  );
}
