import { useState } from "react";
import DownloadPDFButton from "./DownloadPDFButton";

export default function AssessmentForm({ setSolutions }) {
  const [problem, setProblem] = useState("");
  const [localSolutions, setLocalSolutions] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problem }),
      });

      const data = await res.json();
      const result = data.result || "No se recibió respuesta.";

      setLocalSolutions(result);
      setSolutions(result);
    } catch (error) {
      console.error(error);
      setLocalSolutions("Error al conectar con el servidor.");
    }

    setLoading(false);
  };

  return (
    <div className="font-sans text-black">
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-sm font-medium text-black">
          Describe el dolor del cliente:
        </label>
        <textarea
          className="w-full p-3 rounded-md bg-gray-accent/20 border border-gray-700 text-gray-900 placeholder-gray-400
             focus:outline-none focus:border-cyan-500 transition duration-200 ease-in-out"
          rows="4"
          placeholder="Describe el dolor del cliente..."
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
        />

        <div className="w-full flex justify-end">
          <button
            className="mt-3 px-4 py-2 rounded-md font-bold border border-cyan-500 text-cyan-400
              hover:bg-cyan-500 hover:text-white transition duration-200 ease-in-out shadow-sm"
            disabled={loading}
          >
            {loading ? "Analizando..." : "Analizar con IA"}
          </button>
        </div>
      </form>

      {localSolutions &&
        typeof localSolutions === "object" &&
        Object.keys(localSolutions).length > 0 && (
          <div className="mt-6 bg-surface border border-accent/20 p-4 rounded-xl animate-fade-in">
            <h2 className="text-xl font-bold mb-4 text-accent">
              Soluciones propuestas
            </h2>

            <section className="mb-4">
              <h3 className="font-semibold text-cyan-400 mb-1">
                Análisis del problema
              </h3>
              <p className="text-gray-900">{localSolutions.analisis}</p>
            </section>

            <section className="mb-4">
              <h3 className="font-semibold text-emerald-400 mb-1">
                Estrategias a corto plazo
              </h3>
              <ul className="list-disc pl-5 text-gray-900 space-y-2">
                {localSolutions.corto_plazo?.map((item, i) => (
                  <li key={i}>
                    <strong className="text-emerald-500">{item}:</strong>{" "}
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="mb-4">
              <h3 className="font-semibold text-yellow-400 mb-1">
                Estrategias a mediano plazo
              </h3>
              <ul className="list-disc pl-5 text-gray-900 space-y-2">
                {localSolutions.mediano_plazo?.map((item, i) => (
                  <li key={i}>
                    <strong className="text-yellow-500">{item}:</strong>{" "}
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="mb-4">
              <h3 className="font-semibold text-purple-400 mb-1">
                Estrategias a largo plazo
              </h3>
              <ul className="list-disc pl-5 text-gray-900 space-y-2">
                {localSolutions.largo_plazo?.map((item, i) => (
                  <li key={i}>
                    <strong className="text-purple-500">{item}:</strong>{" "}
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-blue-900 mb-1">Conclusión</h3>
              <p className="text-blue-900">{localSolutions.conclusion}</p>
            </section>

            <div className="w-full flex justify-end">
              <DownloadPDFButton data={localSolutions} />
            </div>
          </div>
        )}
    </div>
  );
}
