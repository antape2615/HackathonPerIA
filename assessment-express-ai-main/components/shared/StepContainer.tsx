
import React from 'react';

interface StepContainerProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

const StepContainer: React.FC<StepContainerProps> = ({ title, subtitle, children }) => {
  return (
    <div className="w-full mx-auto animate-fade-in-up">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">{title}</h2>
        <p className="text-lg text-gray-400 mt-2 max-w-2xl mx-auto">{subtitle}</p>
      </div>
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 sm:p-8 shadow-2xl shadow-cyan-500/10">
        {children}
      </div>
    </div>
  );
};

export default StepContainer;