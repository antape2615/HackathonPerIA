package com.testia.infraestructure.adapter.out.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.testia.domain.model.*;
import com.testia.domain.port.AiEvaluationPort;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@Component
public class AiEvaluationAdapter implements AiEvaluationPort {

    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final ObjectMapper mapper;
    private final String apiKey;

    public AiEvaluationAdapter(
            ObjectMapper mapper,
            @Value("${GROQ_API_KEY}") String apiKeyProperty
    ) {
        this.mapper = mapper;

        String envKey = System.getenv("GROQ_API_KEY");
        this.apiKey = (apiKeyProperty != null && !apiKeyProperty.isBlank())
                ? apiKeyProperty
                : envKey;

        if (this.apiKey == null || this.apiKey.isBlank()) {
            throw new IllegalStateException("No Groq API key found");
        }
    }

    @Override
    public EvaluationResult evaluate(CandidateSubmission submission, GeneratedTest test) {
        try {

            // 1 - cargar template
            String template = loadPromptTemplate();

            String testCasesJson = mapper.writeValueAsString(test.getTestCases());
            String finalPrompt = template
                    .replace("{{language}}", test.getLanguage())
                    .replace("{{level}}", test.getLevel())
                    .replace("{{problem}}", test.getProblemStatement())
                    .replace("{{testcases}}", testCasesJson)
                    .replace("{{candidate_code}}", submission.getSubmittedCode());

            // 2 - construir request Groq
            ObjectNode root = mapper.createObjectNode();
            root.put("model", "openai/gpt-oss-20b");

            ArrayNode messages = root.putArray("messages");
            ObjectNode msg = messages.addObject();
            msg.put("role", "user");
            ArrayNode content = msg.putArray("content");
            ObjectNode block = content.addObject();
            block.put("type", "text");
            block.put("text", finalPrompt);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.groq.com/openai/v1/chat/completions"))
                    .header("Authorization", "Bearer " + apiKey)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(root.toString()))
                    .build();

            HttpResponse<String> response = httpClient.send(
                    request,
                    HttpResponse.BodyHandlers.ofString()
            );

            if (response.statusCode() / 100 != 2) {
                throw new RuntimeException("Groq error: " + response.statusCode() + " - " + response.body());
            }

            // 3 - parsear respuesta
            JsonNode groqRoot = mapper.readTree(response.body());
            JsonNode contentNode = groqRoot.path("choices").get(0).path("message").path("content");

            if (contentNode.isMissingNode() || contentNode.asText().isBlank()) {
                throw new RuntimeException("Groq returned empty content");
            }

            JsonNode evalJson = mapper.readTree(contentNode.asText());

            // 4 - mapear
            double overall = evalJson.path("overallScore").asDouble();

            // buckets
            List<BucketScore> bucketScores = new ArrayList<>();
            JsonNode bucketsNode = evalJson.path("bucketScores");
            if (bucketsNode.isArray()) {
                for (JsonNode b : bucketsNode) {
                    bucketScores.add(
                            BucketScore.builder()
                                    .bucketName(b.path("bucketName").asText())
                                    .score(b.path("score").asDouble())
                                    .build()
                    );
                }
            }

            // edge cases
            List<String> edgeCases = new ArrayList<>();
            JsonNode edgeNode = evalJson.path("edgeCaseCoverage");
            if (edgeNode.isArray()) {
                edgeNode.forEach(n -> edgeCases.add(n.asText()));
            }

            // security notes
            List<String> securityNotes = new ArrayList<>();
            JsonNode secNode = evalJson.path("securityNotes");
            if (secNode.isArray()) {
                secNode.forEach(n -> securityNotes.add(n.asText()));
            }

            return EvaluationResult.builder()
                    .overallScore(overall)
                    .bucketScores(bucketScores)
                    .bigOTime(evalJson.path("bigOTime").asText())
                    .bigOSpace(evalJson.path("bigOSpace").asText())
                    .lineCount(evalJson.path("lineCount").asInt())
                    .edgeCaseCoverage(edgeCases)
                    .securityNotes(securityNotes)
                    .globalSummary(evalJson.path("globalSummary").asText())
                    .build();

        } catch (Exception e) {
            throw new RuntimeException("Error al llamar a Groq para evaluación: " + e.getMessage(), e);
        }
    }

    private String loadPromptTemplate() {
        try (InputStream in = new ClassPathResource("templates/EvaluateTestPrompt.txt").getInputStream()) {
            return new String(in.readAllBytes(), StandardCharsets.UTF_8);
        } catch (Exception e) {
            throw new RuntimeException("Cannot load evaluation prompt", e);
        }
    }
}
