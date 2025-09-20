interface Props {
  onEnterChat: () => void;
}

export default function Welcome({ onEnterChat }: Props) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center bg-fixed  p-10"
      style={{
        backgroundImage:
          "url('/phone-message.jpg')",
      }}
    >
      <div className="bg-white/90 backdrop-blur-md p-10 rounded-xl shadow-xl w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Ласкаво просимо 👋
        </h1>
        <p className="text-gray-600 mb-8">
          Це приватний месенджер для спілкування один на один.
        </p>
        <button
          onClick={onEnterChat}
          className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
        >
          Увійти в чат
        </button>
      </div>
    </div>
  );
}
