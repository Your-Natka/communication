import React, { useEffect, useState } from "react";
import { getUsersAPI } from "../../api/api";

interface User {
  id: number;
  username: string;
  display_name?: string;
}

interface UserListProps {
  token: string;
  onSelectUser: (user: User) => void;
}

export default function UserList({ token, onSelectUser }: UserListProps) {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    async function fetchUsers() {
      const res = await getUsersAPI(token);
      setUsers(res);
    }
    fetchUsers();
  }, [token]);

  return (
    <div className="flex flex-col gap-2">
      {users.map(u => (
        <button
          key={u.id}
          className="p-2 bg-gray-200 rounded hover:bg-gray-300"
          onClick={() => onSelectUser(u)}
        >
          {u.display_name || u.username}
        </button>
      ))}
    </div>
  );
}
