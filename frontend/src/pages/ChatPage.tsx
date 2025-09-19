import React, { useState } from "react";
import ChatList from "../components/ChatList";
import Chat from "../components/Chat";

interface Props {
  user: string;
}

export default function ChatPage({ user }: Props) {
  const [selectedReceiver, setSelectedReceiver] = useState<number | null>(null);

  return (
    <div className="flex h-screen">
      {/* Список користувачів/чатів */}
      <ChatList setSelectedReceiver={setSelectedReceiver} />

      {/* Власне чат */}
      <div className="flex-1 bg-gray-50 p-4">
        {selectedReceiver ? (
          <Chat receiverId={selectedReceiver} />
        ) : (
          <div className="text-gray-400 text-center mt-20">Виберіть користувача для чату</div>
        )}
      </div>
    </div>
  );
}