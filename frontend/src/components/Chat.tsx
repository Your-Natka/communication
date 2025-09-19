import { useState, useEffect, ChangeEvent } from "react";

interface Message {
  id: number;
  content: string;
  senderId: number;
  timestamp: string;
  files?: string[];
}

interface Props {
  receiverId: number;
}

export default function Chat({ receiverId }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const token = localStorage.getItem("token");

  // Завантаження повідомлень
  useEffect(() => {
    if (!token) return;

    const fetchMessages = async () => {
      // Замінити на виклик свого API
      // const msgs = await getMessagesAPI(receiverId, token);
      const msgs: Message[] = [
        { id: 1, content: "Привіт!", senderId: 2, timestamp: new Date().toISOString() },
      ];
      setMessages(msgs);
    };
    fetchMessages();
  }, [receiverId, token]);

  const handleSend = async () => {
    if (!text && files.length === 0 || !token) return;

    if (editingId) {
      // Замінити на API редагування
      setMessages(messages.map(m => m.id === editingId ? { ...m, content: text } : m));
      setEditingId(null);
    } else {
      // Замінити на API відправки
      const newMessage: Message = {
        id: Date.now(),
        content: text,
        senderId: 1, // поточний користувач
        timestamp: new Date().toISOString(),
        files: files.map(f => f.name),
      };
      setMessages([...messages, newMessage]);
    }
    setText("");
    setFiles([]);
  };

  const handleEdit = (msg: Message) => {
    setEditingId(msg.id);
    setText(msg.content);
    setFiles([]);
  };

  const handleDelete = (id: number) => {
    // Замінити на API видалення
    setMessages(messages.filter(m => m.id !== id));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles(Array.from(e.target.files));
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded shadow">
      <h1 className="text-xl font-bold mb-4">Private Chat</h1>
      <div className="space-y-2 max-h-96 overflow-y-auto mb-4">
        {messages.map(msg => (
          <div key={msg.id} className="p-2 border rounded">
            <div className="flex justify-between">
              <span className="font-semibold">{msg.senderId === 1 ? "You" : "Other"}</span>
              <span className="text-xs text-gray-500">{new Date(msg.timestamp).toLocaleTimeString()}</span>
            </div>
            <p>{msg.content}</p>
            {msg.files && msg.files.length > 0 && (
              <ul className="text-sm text-blue-600">
                {msg.files.map((f, idx) => <li key={idx}>{f}</li>)}
              </ul>
            )}
            {msg.senderId === 1 && (
              <div className="flex gap-2 mt-1">
                <button className="text-blue-500 text-sm" onClick={() => handleEdit(msg)}>Edit</button>
                <button className="text-red-500 text-sm" onClick={() => handleDelete(msg.id)}>Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <textarea
          className="border p-2 rounded"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Напишіть повідомлення..."
        />
        <input type="file" multiple onChange={handleFileChange} />
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleSend}>
          {editingId ? "Update" : "Send"}
        </button>
      </div>
    </div>
  );
}
