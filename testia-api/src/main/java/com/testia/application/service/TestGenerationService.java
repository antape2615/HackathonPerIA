package com.testia.application.service;

import com.testia.domain.exception.DomainException;
import com.testia.domain.model.GeneratedTest;
import com.testia.domain.port.GeneratedTestRepositoryPort;
import com.testia.domain.port.TestGenerationPort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class TestGenerationService {

    private final TestGenerationPort aiPort;

    public TestGenerationService(TestGenerationPort aiPort) {
        this.aiPort = aiPort;
    }

    public GeneratedTest generateTest(String language, String seniorityLevel) {

        if (language == null || language.isBlank()) {
            throw new DomainException("Language must not be empty", HttpStatus.BAD_REQUEST);
        }

        if (seniorityLevel == null || seniorityLevel.isBlank()) {
            throw new DomainException("Seniority level must not be empty", HttpStatus.BAD_REQUEST);
        }

        try {
            //NO SE GUARDA EN BD
            return aiPort.generateTest(language, seniorityLevel);

        } catch (Exception e) {
            throw new DomainException("Failed to generate test: " + e.getMessage(), HttpStatus.FAILED_DEPENDENCY);
        }
    }
}

