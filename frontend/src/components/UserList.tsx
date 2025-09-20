import React, { useEffect, useState } from "react";

interface User {
  id: number;
  username: string;
}

interface Props {
  token: string;
  onSelectUser: (user: User) => void;
}

export default function UserList({ token, onSelectUser }: Props) {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    async function fetchUsers() {
      const res = await fetch("http://localhost:8000/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUsers(data);
    }
    fetchUsers();
  }, [token]);

  return (
    <div className="bg-white p-4 rounded shadow h-full overflow-auto">
      <h3 className="font-bold mb-2">Користувачі</h3>
      {users.map(u => (
        <button
          key={u.id}
          onClick={() => onSelectUser(u)}
          className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded"
        >
          {u.username}
        </button>
      ))}
    </div>
  );
}
