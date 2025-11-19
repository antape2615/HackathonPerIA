package com.testia.domain.model;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Data
@Builder(toBuilder = true)
public class GeneratedTest {
    private UUID id;
    private String language;          // "java", "python", etc
    private String level;             // "junior", "mid", "senior"
    private String problemStatement;
    private String starterCode;
    private List<TestCase> testCases;
    private List<String> difficultyTags; // ej: ["graphs","dp"]
    private Instant generatedAt;
}
