package com.testia.infraestructure.adapter.out.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.testia.domain.model.GeneratedTest;
import com.testia.domain.model.TestCase;
import com.testia.domain.port.TestGenerationPort;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Component
public class AiTestGenerationAdapter implements TestGenerationPort {

    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final ObjectMapper mapper;
    private final String apiKey;

    public AiTestGenerationAdapter(
            ObjectMapper mapper,
            @Value("${GROQ_API_KEY}") String apiKeyProperty
    ) {
        this.mapper = mapper;

        String envKey = System.getenv("GROQ_API_KEY");
        this.apiKey = apiKeyProperty != null && !apiKeyProperty.isBlank()
                ? apiKeyProperty
                : envKey;

        if (this.apiKey == null || this.apiKey.isBlank()) {
            throw new IllegalStateException("No Groq API key found");
        }
    }

    @Override
    public GeneratedTest generateTest(String language, String seniorityLevel) {
        try {
            // 1️⃣ Cargar prompt PRO
            String promptTemplate = loadPromptTemplate();
            String finalPrompt = promptTemplate
                    .replace("{{language}}", language)
                    .replace("{{seniority}}", seniorityLevel);

            // 2️⃣ Construir request a Groq
            ObjectNode root = mapper.createObjectNode();
            root.put("model", "openai/gpt-oss-20b");

            ArrayNode messages = root.putArray("messages");
            ObjectNode msg = messages.addObject();
            msg.put("role", "user");

            ArrayNode content = msg.putArray("content");
            ObjectNode block = content.addObject();
            block.put("type", "text");
            block.put("text", finalPrompt);

            String requestBody = root.toString();

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.groq.com/openai/v1/chat/completions"))
                    .header("Authorization", "Bearer " + apiKey)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            HttpResponse<String> response = httpClient.send(
                    request,
                    HttpResponse.BodyHandlers.ofString()
            );

            if (response.statusCode() / 100 != 2) {
                throw new RuntimeException(
                        "Groq error: " + response.statusCode() + " - " + response.body()
                );
            }

            // 3️⃣ Parsear respuesta completa
            JsonNode groqRoot = mapper.readTree(response.body());
            JsonNode contentNode = groqRoot
                    .path("choices")
                    .get(0)
                    .path("message")
                    .path("content");

            if (contentNode.isMissingNode() || contentNode.asText().isBlank()) {
                throw new RuntimeException("Groq returned empty content");
            }

            // contentNode es un STRING que contiene JSON
            JsonNode testJson = mapper.readTree(contentNode.asText());

            // ----------------------------
            // 4️⃣ Normalizar y mapear campos
            // ----------------------------

            // problemStatement: descripción del problema
            String problemStatement;
            if (testJson.hasNonNull("problemStatement") && !testJson.get("problemStatement").asText().isBlank()) {
                problemStatement = testJson.get("problemStatement").asText();
            } else if (testJson.hasNonNull("description")) {
                problemStatement = testJson.get("description").asText();
            } else {
                problemStatement = "Descripción no disponible.";
            }

            // starterCode: código base para el editor
            String starterCode;
            if (testJson.hasNonNull("starterCode") && !testJson.get("starterCode").asText().isBlank()) {
                starterCode = testJson.get("starterCode").asText();
            } else if (testJson.hasNonNull("baseCode")) {
                starterCode = testJson.get("baseCode").asText();
            } else if (testJson.hasNonNull("code")) {
                // fallback: a veces el modelo devuelve "code"
                starterCode = testJson.get("code").asText();
            } else {
                starterCode = "// No se recibió código inicial desde la IA.";
            }

            // Difficulty tags
            List<String> tags = new ArrayList<>();
            JsonNode tagsNode = testJson.path("difficultyTags");
            if (tagsNode.isArray()) {
                for (JsonNode t : tagsNode) {
                    tags.add(t.asText());
                }
            }

            // Test cases
            List<TestCase> testCases = new ArrayList<>();
            JsonNode tcArray = testJson.path("testCases");
            if (tcArray.isArray()) {
                for (JsonNode tc : tcArray) {
                    testCases.add(
                            TestCase.builder()
                                    .input(tc.path("input").asText())
                                    .expectedOutput(tc.path("expectedOutput").asText())
                                    // default "inputOutput" si el modelo no manda type
                                    .type(tc.path("type").asText("inputOutput"))
                                    .build()
                    );
                }
            }

            // 5️⃣ Construir modelo de dominio limpio
            return GeneratedTest.builder()
                    .id(UUID.randomUUID())
                    .language(language)            // viene del parámetro del endpoint
                    .level(seniorityLevel)         // viene del parámetro del endpoint
                    .problemStatement(problemStatement)
                    .starterCode(starterCode)
                    .difficultyTags(tags)
                    .testCases(testCases)
                    .generatedAt(Instant.now())
                    .build();

        } catch (Exception e) {
            throw new RuntimeException("Error al llamar a Groq: " + e.getMessage(), e);
        }
    }

    private String loadPromptTemplate() {
        try (InputStream in = new ClassPathResource("templates/GenerateTestPrompt.txt").getInputStream()) {
            return new String(in.readAllBytes(), StandardCharsets.UTF_8);
        } catch (Exception e) {
            throw new RuntimeException("Cannot load Pro prompt", e);
        }
    }
}
