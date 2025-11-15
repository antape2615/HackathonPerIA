
import React, { useState, useCallback } from 'react';
import { useAssessment } from '../../hooks/useAssessment';
import { FileData, WizardStep } from '../../types';
import StepContainer from '../shared/StepContainer';
import Button from '../shared/Button';

const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = (reader.result as string).split(',')[1];
            resolve(base64String);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};


const FileUploadStep: React.FC = () => {
  const { state, dispatch } = useAssessment();
  const [file, setFile] = useState<File | null>(state.fileData ? new File([], state.fileData.name) : null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = async (selectedFile: File | null) => {
    if (selectedFile) {
        setFile(selectedFile);
    }
  };

  const onDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      handleFileChange(event.dataTransfer.files[0]);
      event.dataTransfer.clearData();
    }
  }, []);

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(true);
  };

  const onDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);
  };

  const handleContinue = async () => {
    if (file) {
        const content = await blobToBase64(file);
        const fileData: FileData = {
            name: file.name,
            content,
            type: file.type
        };
        dispatch({ type: 'SET_FILE_DATA', payload: fileData });
    } else {
        dispatch({ type: 'SET_FILE_DATA', payload: undefined });
    }
  }

  return (
    <StepContainer title="Sube un Documento (Opcional)" subtitle="Aporta un plan de negocio, un informe o cualquier archivo relevante para un análisis más profundo.">
        <div className="space-y-6">
             <div 
                onDrop={onDrop}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                className={`relative block w-full border-2 border-dashed rounded-lg p-12 text-center transition-all duration-300 ${isDragOver ? 'border-cyan-400 bg-gray-700/50 scale-105' : 'border-gray-600 hover:border-gray-500'}`}
            >
                <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : null)}
                    accept=".pdf,.txt,.jpg,.jpeg,.png,.docx"
                />
                
                {file ? (
                    <div className="flex flex-col items-center">
                        <svg className="w-12 h-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <span className="mt-2 block font-semibold text-white">{file.name}</span>
                        <p className="text-sm text-gray-400">Archivo seleccionado con éxito.</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center">
                        <svg className="mx-auto h-12 w-12 text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        <span className="mt-2 block text-sm font-medium text-gray-300">Arrastra y suelta un archivo aquí, o haz clic para seleccionar</span>
                        <p className="text-xs text-gray-500">PDF, TXT, JPG, PNG, DOCX de hasta 10MB</p>
                    </div>
                )}
            </div>
            {file && (
                <div className="flex justify-center">
                    <button onClick={() => setFile(null)} className="text-sm text-red-400 hover:text-red-300 font-semibold">Quitar archivo</button>
                </div>
            )}
             <div className="flex justify-between items-center pt-4 border-t border-gray-700 mt-6">
                <Button type="button" variant="secondary" onClick={() => dispatch({type: 'GO_TO_STEP', payload: WizardStep.ClientData})}>Atrás</Button>
                <Button type="button" onClick={handleContinue}>{file ? 'Siguiente' : 'Omitir y Continuar'}</Button>
            </div>
        </div>
    </StepContainer>
  );
};

export default FileUploadStep;