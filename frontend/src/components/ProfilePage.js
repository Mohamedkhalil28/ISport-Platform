import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ProfilePage({ user, onLogout }) {
  const [profile, setProfile] = useState(user);
  const [loading, setLoading] = useState(false);

  const updateProfile = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `http://localhost:5000/users/${user._id}`,
        profile,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfile(res.data);
      alert("Profil mis à jour !");
    } catch (err) {
      alert("Erreur lors de la mise à jour");
    }
    setLoading(false);
  };

  return (
    <div className="page">
      <h2>🧑 Profil</h2>
      <input
        type="text"
        value={profile.name}
        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
      />
      <input
        type="email"
        value={profile.email}
        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
      />
      <button onClick={updateProfile} disabled={loading}>
        {loading ? "⏳ ..." : "Mettre à jour"}
      </button>
      <button onClick={onLogout}>Se déconnecter</button>
    </div>
  );
}
