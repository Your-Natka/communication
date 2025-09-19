import { useState } from "react";

interface Props {
  onEnterChat: () => void;
}

export default function Welcome({ onEnterChat }: Props) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50">
      <h1 className="text-4xl font-bold mb-6">Ласкаво просимо до Messenger!</h1>
      <p className="text-lg mb-6">Спілкуйтеся з друзями один на один.</p>
      <button
        onClick={onEnterChat}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Увійти в чат
      </button>
    </div>
  );
}