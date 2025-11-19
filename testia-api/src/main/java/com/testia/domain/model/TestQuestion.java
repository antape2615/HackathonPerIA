package com.testia.domain.model;

import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
@Builder
public class TestQuestion {
    private UUID id;
    private String title;
    private String description;
    private String difficulty; // JUNIOR, MID, SENIOR
    private String language; // JAVA, PYTHON, JS, etc
    private String expectedSolution; // Solución modelo, NO visible para candidato
    private List<TestCase> testCases; // Casos de prueba
}