import React, { useState } from "react";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import Chat from "./components/Chat";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const handleLogin = (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      {!token ? (
        <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl">
          <div className="flex-1 bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-4 text-center">Register</h2>
            <RegisterForm onRegister={handleLogin} />
          </div>
          <div className="flex-1 bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-4 text-center">Login</h2>
            <LoginForm onLogin={handleLogin} />
          </div>
        </div>
      ) : (
        <div className="w-full max-w-4xl flex flex-col h-[80vh]">
          <div className="flex justify-between items-center mb-4 p-2 bg-white rounded shadow">
            <h2 className="text-xl font-bold">Private Chat</h2>
            <button
              className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
          <div className="flex-1 bg-white rounded shadow p-4 overflow-y-auto">
            <Chat receiverId={1} />
          </div>
        </div>
      )}
    </div>
  );
}
