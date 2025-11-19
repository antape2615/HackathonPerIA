package com.testia.infraestructure.adapter.out.email;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Component
public class BrevoEmailService {

    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final ObjectMapper mapper = new ObjectMapper();

    private final String apiKey;
    private final String senderEmail;
    private final String senderName;

    public BrevoEmailService() {
        this.apiKey = System.getProperty("BREVO_API_KEY");
        this.senderEmail = System.getProperty("BREVO_SENDER_EMAIL");
        this.senderName = System.getProperty("BREVO_SENDER_NAME");

        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException("BREVO_API_KEY no está configurada.");
        }
    }

    public void sendEmail(String toEmail, String subject, String htmlContent) {
        try {
            var body = mapper.createObjectNode();

            // Sender
            var sender = body.putObject("sender");
            sender.put("name", senderName);
            sender.put("email", senderEmail);

            // Receiver
            var to = body.putArray("to");
            var receiver = to.addObject();
            receiver.put("email", toEmail);

            // Email content
            body.put("subject", subject);
            body.put("htmlContent", htmlContent);

            String json = mapper.writeValueAsString(body);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.brevo.com/v3/smtp/email"))
                    .header("accept", "application/json")
                    .header("api-key", apiKey)
                    .header("content-type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(json))
                    .build();

            HttpResponse<String> response = httpClient.send(
                    request,
                    HttpResponse.BodyHandlers.ofString()
            );

            if (response.statusCode() / 100 != 2) {
                throw new RuntimeException("Error from Brevo: " + response.body());
            }
            System.out.println("BREVO RAW RESPONSE:");
            System.out.println("📧 Email enviado correctamente a " + toEmail);

        } catch (Exception ex) {
            throw new RuntimeException("Error enviando email: " + ex.getMessage(), ex);
        }
    }
}
