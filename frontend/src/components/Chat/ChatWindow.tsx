import React from "react";
import Message from "./Message";
import MessageInput from "./MessageInput";

interface MessageData {
  id: number;
  sender: string;
  text: string;
  timestamp: string;
  isOwn: boolean;
}

interface ChatWindowProps {
  messages: MessageData[];
  onSendMessage: (text: string, files: File[]) => void;
}

export default function ChatWindow({ messages, onSendMessage }: ChatWindowProps) {
  return (
    <div className="w-3/4 flex flex-col">
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {messages.map((msg) => (
          <Message
            key={msg.id}
            sender={msg.sender}
            text={msg.text}
            timestamp={msg.timestamp}
            isOwn={msg.isOwn}
            onEdit={() => console.log("Edit", msg.id)}
            onDelete={() => console.log("Delete", msg.id)}
          />
        ))}
      </div>
      <MessageInput onSend={onSendMessage} />
    </div>
  );
}
