
import React from 'react';
import { AssessmentProvider } from './context/AssessmentContext';
import Wizard from './components/Wizard';
import ProgressStepper from './components/shared/ProgressStepper';

function App() {
  return (
    <AssessmentProvider>
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 font-sans overflow-x-hidden">
        <header className="w-full max-w-5xl mx-auto py-4 px-2 flex justify-between items-center">
            <div className="flex items-center space-x-3">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-cyan-400">
                  <path d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2ZM12 20C7.589 20 4 16.411 4 12C4 7.589 7.589 4 12 4C16.411 4 20 7.589 20 12C20 16.411 16.411 20 12 20Z" fill="currentColor" opacity="0.4"/>
                  <path d="M12 6C8.686 6 6 8.686 6 12C6 15.314 8.686 18 12 18V6Z" fill="currentColor"/>
                </svg>
                <h1 className="text-2xl font-bold tracking-tighter text-white">Periscan IA 2.0</h1>
            </div>
            <div className="text-sm text-gray-400">Assessment Express</div>
        </header>
        <ProgressStepper />
        <main className="flex-grow flex items-center justify-center w-full">
          <Wizard />
        </main>
      </div>
    </AssessmentProvider>
  );
}

export default App;