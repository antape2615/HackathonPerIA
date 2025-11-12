import { useState, useEffect } from "react";
import { FaUser, FaRobot, FaSpinner } from "react-icons/fa";
import DownloadPDFButton from "./DownloadPDFButton";

function QuickReply({ options, onSelect }) {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onSelect(opt)}
          className="bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full hover:bg-cyan-200 transition"
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

export default function ChatBot() {
  const [stage, setStage] = useState("intro");
  const [context, setContext] = useState({
    area: null,
    tipo: null,
    impacto: null,
  });
  const [messages, setMessages] = useState([]);
  const [quickReplies, setQuickReplies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const etapas = ["Área", "Tipo", "Impacto", "Confirmación"];

  useEffect(() => {
    sessionStorage.setItem("chat_history", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          role: "ai",
          content:
            "👋 Hola, soy Avalia. Cuéntame tu problema y te ayudaré con una solución empresarial.",
          ts: Date.now(),
        },
      ]);
      setQuickReplies([
        "Ventas",
        "Logística",
        "Atención al cliente",
        "Finanzas",
        "Otro",
      ]);
      setStage("area");
    }
  }, []);

  const formatAnalysis = (analisis) => {
    if (!analisis) return "⚠️ No se recibió análisis.";

    const joinList = (arr) => (arr ? arr.map((i) => `- ${i}`).join("\n") : "");

    return `
      Análisis: ${analisis.analisis}\n 

      Corto plazo:
      ${joinList(analisis.corto_plazo)}\n

      Mediano plazo:
      ${joinList(analisis.mediano_plazo)}\n

      Largo plazo:
      ${joinList(analisis.largo_plazo)}\n

      Conclusión:
      ${analisis.conclusion}
        `;
  };

  const handleSelect = (value) => {
    const newContext = { ...context };

    if (stage === "area") newContext.area = value;
    else if (stage === "tipo") newContext.tipo = value;
    else if (stage === "impacto") newContext.impacto = value;

    setContext(newContext);
    setMessages((m) => [
      ...m,
      { role: "user", content: value, ts: Date.now() },
    ]);
    setQuickReplies([]);

    // Avanzar
    if (stage === "area") {
      setStage("tipo");
      setMessages((m) => [
        ...m,
        {
          role: "ai",
          content: `Gracias. ¿Qué tipo de problema estás enfrentando en el área de ${value}?`,
          ts: Date.now(),
        },
      ]);
      setQuickReplies([
        "Procesos lentos",
        "Falta de visibilidad",
        "Errores frecuentes",
        "Baja productividad",
        "No estoy seguro",
      ]);
    } else if (stage === "tipo") {
      setStage("impacto");
      setMessages((m) => [
        ...m,
        {
          role: "ai",
          content: `Entiendo. ¿Cómo afecta este problema a tu negocio?`,
          ts: Date.now(),
        },
      ]);
      setQuickReplies([
        "Pérdida de clientes",
        "Costos altos",
        "Retrasos",
        "Desmotivación del equipo",
      ]);
    } else if (stage === "impacto") {
      setStage("confirmacion");
      setMessages((m) => [
        ...m,
        {
          role: "ai",
          content: `Perfecto. ¿Quieres que analice este problema con IA?`,
          ts: Date.now(),
        },
      ]);
      setQuickReplies(["Sí, analizar con IA", "No, cambiar información"]);
    } else if (stage === "confirmacion") {
      if (value === "Sí, analizar con IA") {
        sendToBackend({ ...newContext, confirmado: true });
      } else {
        setMessages((m) => [
          ...m,
          {
            role: "ai",
            content:
              "Entendido. Vamos a revisar la información. ¿En qué área de tu empresa estás teniendo dificultades?",
            ts: Date.now(),
          },
        ]);
        setContext({ area: null, tipo: null, impacto: null });
        setStage("area");
        setQuickReplies([
          "Ventas",
          "Logística",
          "Atención al cliente",
          "Finanzas",
          "Otro",
        ]);
      }
    }
  };

  const etapaActualIndex = () => {
    if (stage === "area") return 0;
    if (stage === "tipo") return 1;
    if (stage === "impacto") return 2;
    if (stage === "confirmacion") return 3;
    return -1;
  };

  const sendToBackend = async (contextData) => {
    setLoading(true);

    setMessages((m) => [
      ...m,
      {
        role: "ai",
        content: "Analizando tu problema con IA...",
        ts: Date.now(),
      },
    ]);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/analyze/flow`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(contextData),
        }
      );

      const data = await res.json();

      const formatted = formatAnalysis(data.analisis);
      setAnalysisResult(data.analisis);

      setMessages((m) => [
        ...m,
        {
          role: "ai",
          content: formatted,
          ts: Date.now(),
        },
      ]);

      sessionStorage.setItem(
        "chat_history",
        JSON.stringify([
          ...messages,
          { role: "user", content: "Sí, analizar con IA", ts: Date.now() },
          { role: "ai", content: formatted, ts: Date.now() },
        ])
      );

      setQuickReplies(["Iniciar nuevo análisis"]);
      setStage("area");
      setContext({ area: null, tipo: null, impacto: null });
    } catch (err) {
      console.error("Error al conectar con el servidor:", err);
      setMessages((m) => [
        ...m,
        {
          role: "ai",
          content: "⚠️ Error al conectar con el servidor.",
          ts: Date.now(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickReply = (opt) => {
    if (opt === "Iniciar nuevo análisis") {
      setMessages([
        {
          role: "ai",
          content:
            "👋 Vamos a comenzar un nuevo análisis. ¿En qué área de tu empresa estás teniendo dificultades?",
          ts: Date.now(),
        },
      ]);
      setContext({ area: null, tipo: null, impacto: null });
      setStage("area");
      setQuickReplies([
        "Ventas",
        "Logística",
        "Atención al cliente",
        "Finanzas",
        "Otro",
      ]);
    } else {
      handleSelect(opt);
    }
  };

  const reiniciarChat = () => {
    setMessages([
      {
        role: "ai",
        content:
          "👋 Vamos a comenzar un nuevo análisis. ¿En qué área de tu empresa estás teniendo dificultades?",
        ts: Date.now(),
      },
    ]);
    setContext({ area: null, tipo: null, impacto: null });
    setStage("area");
    setQuickReplies([
      "Ventas",
      "Logística",
      "Atención al cliente",
      "Finanzas",
      "Otro",
    ]);
  };

  return (
    <div className="flex flex-col h-96 bg-white text-gray-800 border border-cyan-600 rounded-xl shadow-2xl">
      <div className="bg-cyan-600 text-white font-semibold px-4 py-3 flex items-center gap-2 rounded-t-xl">
        <FaRobot /> <span>Avalia 🤖 — Asistente Virtual</span>
      </div>
      <div className="flex justify-stretch items-center px-2 py-2 bg-white border-b border-cyan-200 text-sm font-medium">
        {etapas.map((etapa, i) => (
          <div
            key={etapa}
            className={`w-auto flex-1 text-center py-1 rounded ${
              etapaActualIndex() === i
                ? "bg-cyan-600 text-white"
                : "text-cyan-600"
            }`}
          >
            {etapa}
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${
              m.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`flex items-start gap-2 max-w-[80%] ${
                m.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {m.role === "user" ? (
                <FaUser className="text-cyan-500 mt-1" />
              ) : (
                <FaRobot className="text-yellow-500 mt-1" />
              )}
              <div
                className={`px-3 py-2 rounded-2xl text-sm leading-relaxed shadow ${
                  m.role === "user"
                    ? "bg-cyan-500 text-white rounded-br-none"
                    : "bg-gray-200 text-gray-800 rounded-bl-none"
                }`}
              >
                {m.content.split("\n").map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>
            </div>
          </div>
        ))}

        {quickReplies.length > 0 && (
          <QuickReply options={quickReplies} onSelect={handleQuickReply} />
        )}

        {stage !== "area" && (
          <div className="px-4 py-2 border-t border-cyan-200 bg-white">
            <button
              onClick={reiniciarChat}
              className="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition w-full"
            >
              🔄 Iniciar nuevo análisis
            </button>
          </div>
        )}
        {analysisResult && (
          <div className="px-4 mt-3">
            <DownloadPDFButton data={analysisResult} />
          </div>
        )}

        {loading && (
          <div className="flex items-center text-gray-500 text-sm gap-2 mt-2 animate-pulse">
            <FaSpinner className="animate-spin" /> Avalia está pensando...
          </div>
        )}
      </div>
    </div>
  );
}
