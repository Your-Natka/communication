import React, { useState } from "react";

interface Props {
  setUser: (username: string) => void;
}

export default function Register({ setUser }: Props) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Помилка при реєстрації");
      }

      const user = await res.json();
      localStorage.setItem("token", ""); // Тут можна отримати JWT, якщо бекенд відразу його повертає
      localStorage.setItem("username", user.username);
      setUser(user.username);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Реєстрація</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <input
        type="text"
        placeholder="Username"
        className="w-full p-2 border mb-2 rounded"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        className="w-full p-2 border mb-2 rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full p-2 border mb-2 rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
        onClick={handleRegister}
      >
        Зареєструватися
      </button>
    </div>
  );
}