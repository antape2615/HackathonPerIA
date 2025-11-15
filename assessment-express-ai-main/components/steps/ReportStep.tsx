import React from 'react';
import { createRoot } from 'react-dom/client';
import { useAssessment } from '../../hooks/useAssessment';
import { WizardStep } from '../../types';
import StepContainer from '../shared/StepContainer';
import Button from '../shared/Button';
import jsPDF from 'jspdf';
import AnimatedLoader from '../shared/AnimatedLoader';
import { PdfReportTemplate } from '../pdf/PdfReportTemplate';

const ReportStep: React.FC = () => {
  const { state, dispatch } = useAssessment();
  const { diagnosis, finalReport, clientData } = state;
  
  const handleDownloadPdf = async () => {
    if (!diagnosis || !finalReport || !clientData) return;

    // 1. Create a hidden element to render the template
    const reportContainer = document.createElement('div');
    reportContainer.style.position = 'absolute';
    reportContainer.style.left = '-9999px';
    document.body.appendChild(reportContainer);

    // 2. Render the React component into the hidden element
    const root = createRoot(reportContainer);
    root.render(
        <PdfReportTemplate 
            diagnosis={diagnosis} 
            finalReport={finalReport} 
            companyName={clientData.companyName}
        />
    );
    
    // Give React a moment to render
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 3. Use jsPDF to convert the rendered HTML to PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    const element = reportContainer.querySelector('#pdf-report-content');
    
    if (element) {
        await pdf.html(element as HTMLElement, {
            callback: function (doc) {
                doc.save(`Informe_Periscan_IA_2.0_${clientData.companyName.replace(/\s/g, '_') || 'Assessment'}.pdf`);
                // 4. Clean up the hidden element
                root.unmount();
                document.body.removeChild(reportContainer);
            },
            margin: [15, 15, 15, 15],
            autoPaging: 'text',
            width: 180, // A4 width in mm minus margins
            windowWidth: 800 // An arbitrary window width for consistent rendering
        });
    } else {
        // Fallback or error handling
        root.unmount();
        document.body.removeChild(reportContainer);
        alert("Error al generar el PDF.");
    }
  };

  if (state.isLoading && !finalReport) {
      return (
        <StepContainer title="Finalizando tu Informe Personalizado" subtitle="Compilando el diagnóstico y la hoja de ruta seleccionada en un documento completo.">
            <AnimatedLoader />
        </StepContainer>
      )
  }
  
  if (!diagnosis || !finalReport || !clientData) {
    return (
        <StepContainer title="Error" subtitle="Los datos del informe no están disponibles o no se ha seleccionado una estrategia. Por favor, inicia un nuevo assessment.">
            <div className="text-center">
                 <Button onClick={() => dispatch({ type: 'RESET' })}>
                    Iniciar Nuevo Assessment
                </Button>
            </div>
        </StepContainer>
    );
  }

  // Use the PDF Template directly for on-screen display to ensure consistency
  return (
    <StepContainer title="Tu Assessment Completado" subtitle="Aquí tienes el informe completo generado por Periscan AI. Descárgalo para compartirlo.">
        <div className="bg-gray-800 rounded-lg p-6 max-h-[60vh] overflow-y-auto border border-gray-700">
             {/* We use a simplified on-screen version for display */}
             <div className="prose prose-sm md:prose-base prose-invert max-w-none text-gray-300 leading-relaxed">
                 <PdfReportTemplate 
                    diagnosis={diagnosis} 
                    finalReport={finalReport} 
                    companyName={clientData.companyName}
                />
             </div>
        </div>
        <div className="mt-8 pt-6 border-t border-gray-700 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <Button onClick={() => dispatch({ type: 'RESET' })} variant="secondary">
                Nuevo Assessment
            </Button>
            <Button onClick={handleDownloadPdf}>
                Descargar como PDF
            </Button>
        </div>
    </StepContainer>
  );
};

export default ReportStep;