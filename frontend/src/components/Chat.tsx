import { useState, useEffect } from "react";

interface Message {
  id: number;
  content: string;
  senderId: number;
  timestamp: string;
}

interface Props {
  receiverId: number;
}

export default function Chat({ receiverId }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  const token = localStorage.getItem("token");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles(Array.from(e.target.files));
  };

  const handleSend = async () => {
    if (!text && files.length === 0) return;
    if (!token) return;

    // Тут виклик API, наприклад:
    // const newMessage = await sendMessageAPI(text, files, token);
    // setMessages([...messages, newMessage]);

    setText("");
    setFiles([]);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg) => (
          <div key={msg.id} className="mb-2">
            <strong>{msg.senderId === 1 ? "You" : "Friend"}:</strong> {msg.content}
          </div>
        ))}
      </div>
      <div className="p-4 flex gap-2 items-center bg-white">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Напишіть повідомлення..."
          className="flex-1 border rounded p-2"
        />
        <input type="file" multiple onChange={handleFileChange} className="border p-2 rounded" />
        <button onClick={handleSend} className="bg-blue-600 text-white px-4 py-2 rounded">
          Надіслати
        </button>
      </div>
    </div>
  );
}
