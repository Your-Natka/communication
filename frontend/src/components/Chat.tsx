import React, { useState } from "react";
import UserList from "./UserList";

interface User {
  id: number;
  username: string;
}

export default function Chat({ token }: { token: string }) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  return (
    <div className="flex flex-1 gap-4 h-full">
      <UserList token={token} onSelectUser={setSelectedUser} />
      <div className="flex-1 bg-white p-4 rounded shadow">
        {selectedUser ? (
          <h2>Чат з {selectedUser.username}</h2>
        ) : (
          <p>Виберіть користувача для початку чату</p>
        )}
      </div>
    </div>
  );
}
