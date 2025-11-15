
import React, { useState } from 'react';
import { useAssessment } from '../../hooks/useAssessment';
import { ClientData, WizardStep } from '../../types';
import StepContainer from '../shared/StepContainer';
import Button from '../shared/Button';

const ClientDataStep: React.FC = () => {
  const { state, dispatch } = useAssessment();
  const [formData, setFormData] = useState<ClientData>(state.clientData || {
    companyName: '',
    industry: '',
    companySize: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: 'SET_CLIENT_DATA', payload: formData });
  };

  const isFormValid = Object.values(formData).every(value => typeof value === 'string' && value.trim() !== '');

  const inputClasses = "w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition pl-10";

  return (
    <StepContainer title="Cuéntanos sobre tu Negocio" subtitle="Este contexto ayuda a nuestra IA a personalizar el análisis específicamente para ti.">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-300 mb-2">Nombre de la Empresa</label>
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 pt-8">
                <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 11-2 0V4H6v12a1 1 0 11-2 0V4zm4 4a1 1 0 100 2h4a1 1 0 100-2H8z" clipRule="evenodd" /></svg>
            </div>
            <input type="text" name="companyName" id="companyName" value={formData.companyName} onChange={handleChange} required className={inputClasses} placeholder="Ej: InnovateCorp" />
          </div>
          <div className="relative">
            <label htmlFor="companySize" className="block text-sm font-medium text-gray-300 mb-2">Tamaño de la Empresa</label>
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 pt-8">
                <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a1 1 0 011-1h14a1 1 0 110 2H3a1 1 0 01-1-1zM1 15a1 1 0 100 2h18a1 1 0 100-2H1z" /></svg>
            </div>
            <select name="companySize" id="companySize" value={formData.companySize} onChange={handleChange} required className={inputClasses}>
              <option value="" disabled>Selecciona un tamaño...</option>
              <option value="1-10 empleados">1-10 empleados</option>
              <option value="11-50 empleados">11-50 empleados</option>
              <option value="51-200 empleados">51-200 empleados</option>
              <option value="201-1000 empleados">201-1000 empleados</option>
              <option value="1000+ empleados">1000+ empleados</option>
            </select>
          </div>
          <div className="relative md:col-span-2">
            <label htmlFor="industry" className="block text-sm font-medium text-gray-300 mb-2">Sector / Industria</label>
             <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 pt-8">
                <svg className="h-5 w-5 text-gray-400"  viewBox="0 0 20 20" fill="currentColor"><path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm14 0H4v2h12V5zM2 13a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2zm14 0H4v2h12v-2z" /></svg>
            </div>
            <select name="industry" id="industry" value={formData.industry} onChange={handleChange} required className={inputClasses}>
                <option value="" disabled>Selecciona una industria...</option>
                <option value="Tecnología / SaaS">Tecnología / SaaS</option>
                <option value="Finanzas / FinTech">Finanzas / FinTech</option>
                <option value="Salud / HealthTech">Salud / HealthTech</option>
                <option value="Retail / Comercio Electrónico">Retail / Comercio Electrónico</option>
                <option value="Educación / EdTech">Educación / EdTech</option>
                <option value="Manufactura">Manufactura</option>
                <option value="Consultoría">Consultoría</option>
                <option value="Otro">Otro</option>
            </select>
          </div>
        </div>
        <div className="flex justify-between items-center pt-4 border-t border-gray-700 mt-6">
            <Button type="button" variant="secondary" onClick={() => dispatch({type: 'GO_TO_STEP', payload: WizardStep.Welcome})}>Atrás</Button>
            <Button type="submit" disabled={!isFormValid}>Siguiente</Button>
        </div>
      </form>
    </StepContainer>
  );
};

export default ClientDataStep;