import AssessmentForm from "./components/AssessmentForm";
import ChatBubble from "./components/ChatBubble";
import { useState } from "react";
import Dashboard from "./components/DashBoard";

export default function App() {
  const [solutions, setSolutions] = useState(null);

  return (
    <div className="flex flex-col min-h-screen bg-background text-gray-800 transition-all duration-300 ease-in-out">
      {/* Header */}
      <header className="py-6 flex text-center items-center justify-center space-y-2">
        {/* Logo */}
        <img
          src="/logo.png"
          alt="Avalia Logo"
          className="w-12 h-12 mb-2 drop-shadow-md"
        />
        {/* Título */}
        <h1 className="text-4xl font-bold text-accent tracking-tight">
          Assessment Express{" "}
        </h1>
        {/* Logo */}
        <img
          src="/logo.png"
          alt="Avalia Logo"
          className="w-12 h-12 mb-2 drop-shadow-md"
        />
      </header>

      {/* Contenido principal */}
      <main className="flex-grow flex justify-center py-4 px-6">
        <div className="bg-surface w-full md:w-3/4 rounded-2xl p-6 shadow shadow-gray-400">
          <AssessmentForm setSolutions={setSolutions} />
          {solutions && (
            <div className="w-full bg-none animate-fade-in mt-4">
              <Dashboard solutions={solutions} />
            </div>
          )}
        </div>
      </main>

      {/* Chat flotante */}
      <ChatBubble />

      {/* Footer */}
      <footer className="text-sm text-gray-500 mt-6 shadow shadow-gray-800 p-2 w-full text-center">
        Powered by <strong className="text-accent">Groq AI (LLaMA 3.3)</strong>{" "}
        💡
      </footer>
    </div>
  );
}
