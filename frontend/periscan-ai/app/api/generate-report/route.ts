import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { data, assessmentData } = await request.json()

    // Generate HTML report
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Periscan AI - Reporte de Assessment</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    .header {
      text-align: center;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 3px solid #8b5cf6;
    }
    .header h1 {
      color: #8b5cf6;
      margin: 0;
      font-size: 32px;
    }
    .header p {
      color: #666;
      margin: 10px 0 0 0;
    }
    .section {
      margin: 30px 0;
      padding: 20px;
      background: #f9fafb;
      border-radius: 8px;
    }
    .section h2 {
      color: #8b5cf6;
      margin-top: 0;
      font-size: 24px;
    }
    .pain-point {
      background: #fee2e2;
      border-left: 4px solid #ef4444;
      padding: 20px;
      margin: 20px 0;
    }
    .metrics {
      display: flex;
      justify-content: space-around;
      margin: 20px 0;
    }
    .metric {
      text-align: center;
    }
    .metric-value {
      font-size: 36px;
      font-weight: bold;
      color: #8b5cf6;
    }
    .metric-label {
      color: #666;
      font-size: 14px;
    }
    .solution-box {
      background: white;
      padding: 15px;
      margin: 15px 0;
      border-radius: 6px;
      border-left: 4px solid #8b5cf6;
    }
    .solution-box h3 {
      margin: 0 0 15px 0;
      color: #8b5cf6;
    }
    .solution-item {
      padding: 10px 0;
      border-bottom: 1px solid #e5e7eb;
    }
    .solution-item:last-child {
      border-bottom: none;
    }
    .recommendation {
      padding: 10px 0;
      padding-left: 25px;
      position: relative;
    }
    .recommendation:before {
      content: "✓";
      position: absolute;
      left: 0;
      color: #8b5cf6;
      font-weight: bold;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #e5e7eb;
      text-align: center;
      color: #666;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🧠 Periscan AI</h1>
    <p>Reporte de Assessment Express</p>
    <p><strong>${assessmentData.companyName}</strong> - ${assessmentData.industry}</p>
    <p style="font-size: 12px; color: #999;">Generado el ${new Date().toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })}</p>
  </div>

  <div class="pain-point">
    <h2 style="margin-top: 0; color: #ef4444;">🎯 Dolor Crítico Identificado</h2>
    <p style="font-size: 16px; margin: 0;">${data.painPointSummary}</p>
  </div>

  <div class="section">
    <h2>📊 Análisis de Impacto</h2>
    <div class="metrics">
      <div class="metric">
        <div class="metric-value">${data.impact.business}%</div>
        <div class="metric-label">Impacto en Negocio</div>
      </div>
      <div class="metric">
        <div class="metric-value">${data.impact.urgency}%</div>
        <div class="metric-label">Urgencia</div>
      </div>
      <div class="metric">
        <div class="metric-value">${data.impact.roi}%</div>
        <div class="metric-label">ROI Potencial</div>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>🗺️ Roadmap Estratégico</h2>
    
    <div class="solution-box">
      <h3>⚡ Corto Plazo (0-3 meses)</h3>
      ${data.solutions.shortTerm
        .map((sol: string, i: number) => `<div class="solution-item"><strong>${i + 1}.</strong> ${sol}</div>`)
        .join("")}
    </div>

    <div class="solution-box">
      <h3>🎯 Mediano Plazo (3-12 meses)</h3>
      ${data.solutions.mediumTerm
        .map((sol: string, i: number) => `<div class="solution-item"><strong>${i + 1}.</strong> ${sol}</div>`)
        .join("")}
    </div>

    <div class="solution-box">
      <h3>📈 Largo Plazo (+12 meses)</h3>
      ${data.solutions.longTerm
        .map((sol: string, i: number) => `<div class="solution-item"><strong>${i + 1}.</strong> ${sol}</div>`)
        .join("")}
    </div>
  </div>

  <div class="section">
    <h2>💡 Recomendaciones Clave</h2>
    ${data.recommendations.map((rec: string) => `<div class="recommendation">${rec}</div>`).join("")}
  </div>

  <div class="section">
    <h2>📋 Información del Assessment</h2>
    <p><strong>Empresa:</strong> ${assessmentData.companyName}</p>
    <p><strong>Industria:</strong> ${assessmentData.industry}</p>
    <p><strong>Dolor Principal:</strong> ${assessmentData.painPoint}</p>
    <p><strong>Proceso Actual:</strong> ${assessmentData.currentProcess}</p>
    <p><strong>Objetivos:</strong> ${assessmentData.goals}</p>
    <p><strong>Timeline:</strong> ${assessmentData.timeline}</p>
    ${assessmentData.budget ? `<p><strong>Presupuesto:</strong> ${assessmentData.budget}</p>` : ""}
  </div>

  <div class="footer">
    <p><strong>Periscan AI</strong> - Assessment Express Potenciado con IA</p>
    <p>Tech Battle Latam 2025 | Powered by Groq AI</p>
    <p style="font-size: 12px; margin-top: 10px;">
      Este reporte fue generado automáticamente por inteligencia artificial.<br>
      Para más información, visita periscan.ai
    </p>
  </div>
</body>
</html>
    `

    // Return HTML as downloadable file
    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html",
        "Content-Disposition": `attachment; filename="periscan-report-${assessmentData.companyName || "empresa"}.html"`,
      },
    })
  } catch (error) {
    console.error("[v0] Error generating report:", error)
    return NextResponse.json({ error: "Error generating report" }, { status: 500 })
  }
}
