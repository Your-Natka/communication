import React, { useState } from "react";

interface MessageInputProps {
  onSend: (text: string, files: File[]) => void;
}

export default function MessageInput({ onSend }: MessageInputProps) {
  const [text, setText] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSend = () => {
    if (text.trim() || files.length > 0) {
      onSend(text, files);
      setText("");
      setFiles([]);
    }
  };

  return (
    <div className="flex items-center space-x-2 p-2 border-t bg-white">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Напишіть повідомлення..."
        className="flex-1 border rounded px-3 py-2"
      />
      <input type="file" multiple onChange={handleFileChange} />
      <button
        onClick={handleSend}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Надіслати
      </button>
    </div>
  );
}
