import { useState } from "react";
import { registerUser } from "../../api/api";

interface RegisterFormProps {
  onRegister?: (token: string) => void;
}

export default function RegisterForm({ onRegister }: RegisterFormProps) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(""); // очищаємо повідомлення

    try {
        const response = await registerUser({ username, email, password });

        // якщо бекенд повертає токен
        if (response.token) {
            if (onRegister) onRegister(response.token);
            setMessage("Реєстрація успішна!");
        } else {
            setMessage("Помилка реєстрації");
        }
    } catch (error: any) {
        console.error(error);
        setMessage(error.message || "Помилка під час реєстрації");
    }
};

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="border p-2 rounded"
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 rounded"
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded mt-2">
        Register
      </button>
    </form>
  );
}
