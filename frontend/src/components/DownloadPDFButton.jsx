export default function DownloadPDFButton({ data }) {
  const handleDownloadPDF = async () => {
    if (!data || Object.keys(data).length === 0) {
      alert("⚠️ No hay datos para generar el PDF.");
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/analyze/pdf`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      if (!res.ok) throw new Error("Error al generar el PDF en el servidor.");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "diagnostico-avalia.pdf";
      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error descargando PDF:", error);
    }
  };

  return (
    <button
      onClick={handleDownloadPDF}
      className="mt-3 px-4 py-2 rounded-md font-bold border border-cyan-500 text-cyan-400
        hover:bg-cyan-500 hover:text-white transition duration-200 ease-in-out shadow-sm"
    >
      Descargar PDF
    </button>
  );
}
