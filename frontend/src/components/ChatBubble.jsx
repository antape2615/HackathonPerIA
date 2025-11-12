import { useState } from "react";
import ChatBot from "./ChatBot";
import { FaRobot, FaTimes } from "react-icons/fa";

export default function ChatBubble() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className="fixed bottom-6 right-6 z-50 bg-cyan-500 hover:bg-cyan-400 text-white p-4 rounded-full shadow-lg cursor-pointer transition duration-300"
        onClick={() => setOpen(!open)}
        title={open ? "Cerrar Avalia" : "Habla con Avalia"}
      >
        {open ? <FaTimes size={24} /> : <FaRobot size={24} />}
      </div>

      {open && (
        <div className="fixed bottom-24 right-6 z-40 w-80 backdrop-blur-md bg-gray-900/95 text-white rounded-xl shadow-2xl overflow-hidden border border-cyan-500 animate-fade-in">
          <ChatBot />
        </div>
      )}
    </>
  );
}
