const PdfPrinter = require('pdfmake');
import { Injectable } from '@nestjs/common';
import Groq from 'groq-sdk';
import { AnalyzeFlowDto } from './dto/analyze-flow.dto';
import { Response } from 'express';
import fs from 'fs';

@Injectable()
export class AnalyzeService {
  private client = new Groq({ apiKey: process.env.GROQ_API_KEY });

  // Función que envía el prompt a Groq / IA
  async processProblem(problemPrompt: string, source?: string) {
    const prompt =
      source === 'chatbot'
        ? `
        Eres Avalia, una asistente virtual experta en diagnóstico empresarial.
        Analiza el siguiente problema y responde con tono empático y conversacional.
        Devuelve UNICAMENTE un JSON con esta estructura exacta:
        {
          "analisis": "texto del análisis general",
          "corto_plazo": ["item1", "item2"],
          "mediano_plazo": ["item1", "item2"],
          "largo_plazo": ["item1", "item2"],
          "conclusion": "resumen final"
        }
        No incluyas texto adicional ni comentarios fuera del JSON.

        Instrucciones adicionales:
        - Devuelve entre 2 y 5 objetos por array (si el issue es muy simple, se permiten 1-2).
        - Cada "detalle" debe ser completo: explicar el porqué, pasos básicos y un resultado esperado.
        - Asegúrate de que el JSON sea válido (comillas dobles, sin comentarios, sin texto fuera del JSON).
        - No incluyas ejemplos ni claves adicionales.
        - Problema: ${problemPrompt}

                `
        : `
        Eres un consultor empresarial. Analiza el siguiente problema y devuelve UNICAMENTE un JSON con esta estructura exacta:
        {
          "analisis": "texto del análisis general",
          "corto_plazo": ["item1", "item2"],
          "mediano_plazo": ["item1", "item2"],
          "largo_plazo": ["item1", "item2"],
          "conclusion": "resumen final"
        }
        No incluyas texto adicional ni comentarios fuera del JSON.

        Instrucciones adicionales:
        - Devuelve entre 2 y 5 objetos por array (si el issue es muy simple, se permiten 1-2).
        - Cada "detalle" debe ser completo: explicar el porqué, pasos básicos y un resultado esperado.
        - Asegúrate de que el JSON sea válido (comillas dobles, sin comentarios, sin texto fuera del JSON).
        - No incluyas ejemplos ni claves adicionales.
        - Problema: ${problemPrompt}

      `;

    try {
      const response = await this.client.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
      });

      let text = response.choices[0].message.content || '';

      text = text
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();

      let result;
      try {
        result = JSON.parse(text);
      } catch (err) {
        console.error('Error parseando JSON:', err);
        result = { analisis: text };
      }

      return { result };
    } catch (error) {
      console.error('Error al procesar con Groq:', error);
      return { error: 'Error al procesar con IA' };
    }
  }

  async guidedConversation(dto: AnalyzeFlowDto) {
    const { area, tipo, impacto, confirmado } = dto;

    if (!area || !tipo || !impacto) {
      return {
        message:
          '⚠️ Faltan datos para el análisis. Por favor completa todas las opciones.',
        final: false,
      };
    }

    const problemPrompt = `
    Área: ${area}
    Tipo de problema: ${tipo}
    Impacto en el negocio: ${impacto}
    `;

    if (confirmado) {
      const analisis = await this.processProblem(problemPrompt, 'chatbot');

      return {
        message: `**Análisis completado:**\n\n${analisis.result.analisis || JSON.stringify(analisis.result)}`,
        problem: problemPrompt,
        analisis: analisis.result,
        final: true,
      };
    }
    return {
      message: `¿Quieres que analice este problema con IA?\n\n"${problemPrompt}"`,
      options: ['Sí, analizar con IA', 'No, cambiar información'],
      problem: problemPrompt,
      confirmable: true,
      final: false,
    };
  }

  async generatePDF(data: any, res: Response) {
    const logoBase64 = fs.readFileSync('assets/logo.png', {
      encoding: 'base64',
    });
    try {
      const fonts = {
        Helvetica: {
          normal: 'Helvetica',
          bold: 'Helvetica-Bold',
          italics: 'Helvetica-Oblique',
        },
      };

      const printer = new (PdfPrinter as any)(fonts);

      const docDefinition = {
        content: [
          {
            image: `data:image/png;base64,${logoBase64}`,
            width: 50,
            alignment: 'center',
            margin: [0, 0, 0, 10],
          },
          { text: 'ASSESSMENT EXPRESS', style: 'header' },
          { text: '\nAnálisis del problema', style: 'subheader' },
          { text: data.analisis || 'Sin análisis disponible' },

          { text: '\nEstrategias a corto plazo', style: 'subheader' },
          { ul: data.corto_plazo || [] },

          { text: '\nEstrategias a mediano plazo', style: 'subheader' },
          { ul: data.mediano_plazo || [] },

          { text: '\nEstrategias a largo plazo', style: 'subheader' },
          { ul: data.largo_plazo || [] },

          { text: '\nConclusión', style: 'subheader' },
          { text: data.conclusion || 'Sin conclusión disponible' },
        ],
        styles: {
          header: {
            fontSize: 18,
            bold: true,
            alignment: 'center',
            color: '#0ea5e9',
            margin: [0, 0, 0, 10],
          },
          subheader: {
            fontSize: 14,
            bold: true,
            margin: [0, 10, 0, 5],
            color: '#10b981',
          },
        },
        defaultStyle: {
          font: 'Helvetica',
        },
      };

      const pdfDoc = printer.createPdfKitDocument(docDefinition);
      const chunks: any[] = [];

      pdfDoc.on('data', (chunk) => chunks.push(chunk));
      pdfDoc.on('end', () => {
        const pdfBuffer = Buffer.concat(chunks);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader(
          'Content-Disposition',
          'attachment; filename="diagnostico-avalia.pdf"',
        );
        res.send(pdfBuffer);
      });

      pdfDoc.end();
    } catch (err) {
      console.error('Error generando PDF:', err);
      res.status(500).json({ error: 'Error al generar el PDF' });
    }
  }
}
