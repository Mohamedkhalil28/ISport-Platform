import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AdminPage({ onLogout }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (err) {
        alert("Erreur de chargement des users");
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="page">
      <h2>👑 Espace Admin</h2>
      <button onClick={onLogout}>Se déconnecter</button>
      <h3>Liste des utilisateurs :</h3>
      <ul>
        {users.map((u) => (
          <li key={u._id}>
            {u.name} - {u.email}
          </li>
        ))}
      </ul>
    </div>
  );
}
