import React, { useEffect, useState } from "react";
import { getUsersAPI, getMessagesAPI, sendMessageAPI } from "../../api/api";

interface User {
  id: number;
  username: string;
  display_name?: string;
}

interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  content: string;
  created_at: string;
}

interface ChatProps {
  token: string;
}

export default function Messenger({ token }: ChatProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  // Завантажуємо користувачів
  useEffect(() => {
    async function fetchUsers() {
      const res = await getUsersAPI(token);
      setUsers(res);
    }
    fetchUsers();
  }, [token]);

  // Завантажуємо повідомлення між поточним користувачем і вибраним
  useEffect(() => {
    if (!selectedUser) return;
    async function fetchMessages() {
      const res = await getMessagesAPI(token);
      // Фільтруємо тільки ті повідомлення, що між користувачами
      const chatMessages = res.filter(
        (m: Message) =>
          (m.sender_id === selectedUser.id || m.receiver_id === selectedUser.id)
      );
      setMessages(chatMessages);
    }
    fetchMessages();
  }, [selectedUser, token]);

  const handleSend = async () => {
    if (!selectedUser || !newMessage.trim()) return;
    await sendMessageAPI(newMessage, [], token);
    setMessages([...messages, {
      id: Date.now(),
      sender_id: 0, // або id поточного користувача
      receiver_id: selectedUser.id,
      content: newMessage,
      created_at: new Date().toISOString()
    }]);
    setNewMessage("");
  };

  return (
    <div className="flex h-full gap-4">
      {/* Список користувачів */}
      <div className="w-1/4 bg-white p-3 rounded shadow overflow-y-auto">
        <h3 className="font-bold mb-2">Користувачі</h3>
        {users.map(u => (
          <button
            key={u.id}
            className={`w-full p-2 mb-1 rounded text-left ${
              selectedUser?.id === u.id ? "bg-blue-200" : "bg-gray-100"
            }`}
            onClick={() => setSelectedUser(u)}
          >
            {u.display_name || u.username}
          </button>
        ))}
      </div>

      {/* Чат */}
      <div className="flex-1 flex flex-col bg-white p-3 rounded shadow">
        <h3 className="font-bold mb-2">
          {selectedUser ? `Чат з ${selectedUser.display_name || selectedUser.username}` : "Виберіть користувача"}
        </h3>

        <div className="flex-1 overflow-y-auto mb-2 border rounded p-2">
          {messages.map(m => (
            <div key={m.id} className={`mb-1 ${m.sender_id === 0 ? "text-right" : "text-left"}`}>
              <span className="bg-gray-200 p-1 rounded inline-block">{m.content}</span>
            </div>
          ))}
        </div>

        {selectedUser && (
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 border p-2 rounded"
              placeholder="Написати повідомлення..."
            />
            <button onClick={handleSend} className="bg-blue-500 text-white px-4 rounded">
              Надіслати
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
