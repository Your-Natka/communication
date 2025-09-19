import { useEffect, useState } from "react";

interface User {
  id: number;
  username: string;
}

interface Props {
  onSelect: (user: User) => void;
}

export default function UsersList({ onSelect }: Props) {
  const [users, setUsers] = useState<User[]>([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUsers = async () => {
      if (!token) return;
      const res = await fetch("http://localhost:8000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUsers(data);
    };
    fetchUsers();
  }, [token]);

  return (
    <div className="w-1/4 border-r p-4">
      <h2 className="font-bold mb-2">Contacts</h2>
      {users.map((user) => (
        <div
          key={user.id}
          className="p-2 cursor-pointer hover:bg-gray-100 rounded"
          onClick={() => onSelect(user)}
        >
          {user.username}
        </div>
      ))}
    </div>
  );
}
