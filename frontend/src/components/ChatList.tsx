import React, { useEffect, useState } from "react";

interface Props {
  setSelectedReceiver: (id: number) => void;
}

interface User {
  id: number;
  username: string;
}

export default function ChatList({ setSelectedReceiver }: Props) {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // Тут зробимо запит до бекенду щоб отримати список користувачів
    async function fetchUsers() {
      const res = await fetch("/api/users");
      const data = await res.json();
      setUsers(data);
    }
    fetchUsers();
  }, []);

  return (
    <div className="w-64 border-r bg-white overflow-y-auto">
      <h2 className="p-4 font-bold border-b">Користувачі</h2>
      {users.map((user) => (
        <div
          key={user.id}
          className="p-4 cursor-pointer hover:bg-gray-100"
          onClick={() => setSelectedReceiver(user.id)}
        >
          {user.username}
        </div>
      ))}
    </div>
  );
}
