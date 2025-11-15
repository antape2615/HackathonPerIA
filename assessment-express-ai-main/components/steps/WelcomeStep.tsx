import React from 'react';
import { useAssessment } from '../../hooks/useAssessment';
import Button from '../shared/Button';
import { WizardStep } from '../../types';

const WelcomeStep: React.FC = () => {
  const { dispatch } = useAssessment();

  return (
    <div className="text-center animate-fade-in-up p-8 relative isolate">
       <div className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]" aria-hidden="true">
        <div className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#06b6d4] to-[#0891b2] opacity-20 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]" style={{clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'}}></div>
      </div>
      <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight">
        Bienvenido a <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-300">Periscan IA 2.0</span>
      </h1>
      <p className="mt-4 text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
        Desbloquea insights accionables para tu negocio. Identifiquemos tus desafíos clave y diseñemos el futuro, juntos.
      </p>
      <div className="mt-12">
        <Button 
          onClick={() => dispatch({ type: 'START_ASSESSMENT' })} 
          variant="primary" 
          className="text-lg px-10 py-4 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-400/40 transform hover:scale-105 animate-pulse-slow"
        >
          Comenzar Assessment
        </Button>
      </div>
    </div>
  );
};

export default WelcomeStep;