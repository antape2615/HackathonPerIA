package com.testia.infraestructure.adapter.out.email;

import com.testia.domain.model.GeneratedTest;

public class EmailTemplates {

    public static String buildTestInvitationEmail(GeneratedTest test, String link) {

        return """
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Invitación a prueba técnica - TestIA</title>
<style>
    body {
        background: #f5f7fa;
        margin: 0;
        padding: 0;
        font-family: Arial, sans-serif;
        color: #333;
    }
    .container {
        max-width: 600px;
        background: #ffffff;
        margin: 30px auto;
        border-radius: 12px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.08);
        overflow: hidden;
        border: 1px solid #e5e9f0;
    }
    .header {
        background: #2563eb;
        padding: 25px;
        text-align: center;
        color: #fff;
    }
    .header h1 {
        margin: 0;
        font-size: 26px;
        font-weight: bold;
    }
    .content {
        padding: 30px;
        line-height: 1.6;
        font-size: 16px;
    }
    .content h2 {
        color: #2563eb;
        font-size: 22px;
        margin-bottom: 10px;
    }
    .btn {
        display: inline-block;
        background: #2563eb;
        color: #fff !important;
        padding: 14px 28px;
        margin: 25px 0;
        text-decoration: none;
        font-weight: bold;
        font-size: 16px;
        border-radius: 8px;
        text-align: center;
    }
    .footer {
        background: #f0f2f5;
        text-align: center;
        padding: 15px;
        font-size: 12px;
        color: #666;
    }
</style>
</head>

<body>

<div class="container">

    <div class="header">
        <h1>TestIA Platform</h1>
    </div>

    <div class="content">
        <h2>¡Has sido invitado a una prueba técnica!</h2>

        <p>Un reclutador te ha asignado la siguiente prueba técnica:</p>

        <p>
            <strong>Lenguaje:</strong> %s<br>
            <strong>Nivel:</strong> %s<br>
        </p>

        <p>
            A continuación puedes iniciar la prueba haciendo clic en el botón:
        </p>

        <div style="text-align: center;">
            <a href="%s" class="btn">Comenzar prueba</a>
        </div>

        <p>
            Si presentas dificultades técnicas, comunícate con el reclutador para recibir ayuda.
        </p>

        <p>
            ¡Muchos éxitos!<br>
            <strong>Equipo TestIA</strong>
        </p>
    </div>

    <div class="footer">
        © 2025 TestIA — Plataforma inteligente para evaluación técnica.
    </div>

</div>

</body>
</html>
""".formatted(
                test.getLanguage(),
                test.getLevel(),
                link
        );
    }

}
