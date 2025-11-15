import React from 'react';
import { useAssessment } from '../../hooks/useAssessment';
import { WizardStep } from '../../types';
import Button from '../shared/Button';

const LegalStep: React.FC = () => {
    const { dispatch } = useAssessment();

    return (
        <div className="text-center animate-fade-in-up max-w-3xl mx-auto p-4">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 sm:p-8 shadow-2xl">
                <h1 className="text-3xl font-bold text-cyan-400">
                    Tech Battle Latam 2025
                </h1>
                <h2 className="text-xl font-semibold text-white mt-1">
                    Reto 1: Assesment Express con IA
                </h2>
                
                <p className="mt-4 text-gray-300">
                    Esta aplicación es una solución prototipo diseñada para el reto de rediseñar Periscan como un producto digital dinámico e interactivo, potenciado con Inteligencia Artificial.
                </p>
                
                <div className="mt-6 text-sm text-gray-400 space-y-2">
                    <p>
                        Desarrollado por: <span className="font-semibold text-white">JESSY QUINTO TORRES</span>
                    </p>
                    <p>
                        Un agradecimiento especial a <span className="font-semibold text-white">Periferia IT Group</span> por la oportunidad.
                    </p>
                     <p className="pt-4 text-xs">
                        © 2025. Todos los derechos reservados.
                    </p>
                </div>

                <div className="mt-8">
                    <Button 
                        onClick={() => dispatch({ type: 'GO_TO_STEP', payload: WizardStep.Welcome })}
                        variant="primary"
                    >
                        Continuar a la Aplicación
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default LegalStep;