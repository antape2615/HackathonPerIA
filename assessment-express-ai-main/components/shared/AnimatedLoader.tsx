import React, { useState, useEffect } from 'react';

const thinkingSteps = [
    "Analizando datos del cliente...",
    "Cruzando con benchmarks de la industria...",
    "Identificando puntos de dolor principales...",
    "Detectando patrones subyacentes...",
    "Sintetizando insights clave...",
    "Finalizando diagnóstico...",
];

const AnimatedLoader: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [dots, setDots] = useState('');

    useEffect(() => {
        const stepInterval = setInterval(() => {
            setCurrentStep(prev => (prev + 1));
        }, 2500);
        
        const dotInterval = setInterval(() => {
            setDots(d => (d.length >= 3 ? '' : d + '.'));
        }, 500);

        return () => {
            clearInterval(stepInterval);
            clearInterval(dotInterval);
        };
    }, []);

    const displayedStepText = thinkingSteps[currentStep % thinkingSteps.length];

    return (
        <div className="flex flex-col items-center justify-center space-y-6 text-center py-16">
            <div className="relative w-20 h-20 flex items-center justify-center">
                <div className="absolute inset-0 border-4 border-cyan-500/30 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-transparent border-t-cyan-500 rounded-full animate-spin"></div>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-cyan-400 w-10 h-10">
                  <path d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2ZM12 20C7.589 20 4 16.411 4 12C4 7.589 7.589 4 12 4C16.411 4 20 7.589 20 12C20 16.411 16.411 20 12 20Z" fill="currentColor" opacity="0.4"/>
                  <path d="M12 6C8.686 6 6 8.686 6 12C6 15.314 8.686 18 12 18V6Z" fill="currentColor"/>
                </svg>
            </div>
            <div className="relative h-8 w-full overflow-hidden">
                 <span 
                    key={displayedStepText} 
                    className="absolute inset-0 text-xl font-semibold text-white animate-fade-in-up transition-all duration-500"
                >
                    {displayedStepText}{dots}
                </span>
            </div>
        </div>
    );
};

export default AnimatedLoader;