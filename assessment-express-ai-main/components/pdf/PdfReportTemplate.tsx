import React from 'react';
import { Diagnosis, FinalReport, DetailedInitiative } from '../../types';

interface PdfReportProps {
    diagnosis: Diagnosis;
    finalReport: FinalReport;
    companyName: string;
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div style={{ marginBottom: '24px', pageBreakInside: 'avoid' }}>
        <h3 style={{ fontSize: '16pt', fontWeight: 'bold', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px', marginBottom: '12px', color: '#111827' }}>{title}</h3>
        <div style={{ fontSize: '10pt', color: '#374151', lineHeight: '1.6' }}>
            {children}
        </div>
    </div>
);

const InitiativeCard: React.FC<{ initiative: DetailedInitiative }> = ({ initiative }) => (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px', marginBottom: '16px', pageBreakInside: 'avoid' }}>
        <h4 style={{ fontSize: '12pt', fontWeight: 'bold', color: '#111827' }}>{initiative.title}</h4>
        <p style={{ fontSize: '10pt', color: '#4b5563', marginBottom: '12px' }}>{initiative.description}</p>
        
        <h5 style={{ fontWeight: 'bold', fontSize: '10pt', color: '#1f2937', marginBottom: '4px' }}>Pasos Accionables</h5>
        <ul style={{ paddingLeft: '20px', margin: 0 }}>{initiative.actionableSteps.map((step, i) => <li key={i}>{step}</li>)}</ul>
        
        <h5 style={{ fontWeight: 'bold', fontSize: '10pt', color: '#1f2937', marginTop: '12px', marginBottom: '4px' }}>KPIs Clave</h5>
        <ul style={{ paddingLeft: '20px', margin: 0 }}>{initiative.kpis.map((kpi, i) => <li key={i}>{kpi}</li>)}</ul>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #f3f4f6' }}>
            <div>
                <h5 style={{ fontWeight: 'bold', fontSize: '10pt', color: '#d97706', marginBottom: '4px' }}>Riesgos Potenciales</h5>
                <ul style={{ paddingLeft: '20px', margin: 0 }}>{initiative.potentialRisks.map((risk, i) => <li key={i}>{risk}</li>)}</ul>
            </div>
            <div>
                <h5 style={{ fontWeight: 'bold', fontSize: '10pt', color: '#16a34a', marginBottom: '4px' }}>Estrategias de Mitigación</h5>
                <ul style={{ paddingLeft: '20px', margin: 0 }}>{initiative.mitigationStrategies.map((strat, i) => <li key={i}>{strat}</li>)}</ul>
            </div>
        </div>

        <h5 style={{ fontWeight: 'bold', fontSize: '10pt', color: '#1f2937', marginTop: '12px', marginBottom: '4px' }}>Roles Requeridos</h5>
        <p>{initiative.requiredRoles.join(', ')}</p>
    </div>
);


export const PdfReportTemplate: React.FC<PdfReportProps> = ({ diagnosis, finalReport, companyName }) => {
    return (
        <div id="pdf-report-content" style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#111827', background: 'white', padding: '20px' }}>
            <header style={{ textAlign: 'center', borderBottom: '2px solid #06b6d4', paddingBottom: '16px', marginBottom: '24px' }}>
                <h1 style={{ fontSize: '24pt', fontWeight: 'bold', margin: 0 }}>Periscan IA 2.0</h1>
                <h2 style={{ fontSize: '14pt', color: '#4b5563', margin: '4px 0 0' }}>Informe de Assessment Estratégico</h2>
                <p style={{ fontSize: '10pt', color: '#6b7280', margin: '4px 0 0' }}>Preparado para: {companyName}</p>
            </header>
            
            <main>
                <Section title="Resumen Ejecutivo">
                    <p>{finalReport.executiveSummary}</p>
                </Section>
                
                <Section title="Diagnóstico: Desafíos Centrales">
                    <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px' }}>
                        <h4 style={{ fontWeight: 'bold', fontSize: '11pt', color: '#111827' }}>Punto de Dolor Principal</h4>
                        <p>{diagnosis.mainPainPoint}</p>
                        <h4 style={{ fontWeight: 'bold', fontSize: '11pt', color: '#111827', marginTop: '12px' }}>Puntos de Dolor Secundarios</h4>
                        <ul style={{ paddingLeft: '20px', margin: '8px 0 0' }}>
                            {diagnosis.secondaryPainPoints.map((p, i) => <li key={i}>{p}</li>)}
                        </ul>
                    </div>
                </Section>

                <Section title="Hoja de Ruta Detallada">
                    {finalReport.detailedRoadmap.map((initiative, index) => (
                        <InitiativeCard key={index} initiative={initiative} />
                    ))}
                </Section>
                
                <Section title="Recomendación Comercial">
                    <p>{finalReport.commercialRecommendation}</p>
                </Section>
            </main>
        </div>
    );
};
