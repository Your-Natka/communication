import { useState } from "react";
import UsersList from "./UsersList";
import Chat from "./Chat";

interface User {
  id: number;
  username: string;
}

export default function ChatContainer() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  return (
    <div className="flex h-screen">
      <UsersList onSelect={setSelectedUser} />
      <div className="flex-1 p-4">
        {selectedUser ? (
          <Chat receiverId={selectedUser.id} />
        ) : (
          <div className="text-center text-gray-500 mt-20">
            Select a user to start chat
          </div>
        )}
      </div>
    </div>
  );
}
