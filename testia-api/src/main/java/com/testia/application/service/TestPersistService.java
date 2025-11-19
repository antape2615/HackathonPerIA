package com.testia.application.service;

import com.testia.application.dto.CreateTestRequest;
import com.testia.domain.model.GeneratedTest;
import com.testia.domain.port.GeneratedTestRepositoryPort;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
public class TestPersistService {

    private final GeneratedTestRepositoryPort repo;

    public TestPersistService(GeneratedTestRepositoryPort repo) {
        this.repo = repo;
    }

    public GeneratedTest save(CreateTestRequest req) {

        GeneratedTest test = GeneratedTest.builder()
                .id(UUID.randomUUID())
                .language(req.language())
                .level(req.level())
                .problemStatement(req.problemStatement())
                .starterCode(req.starterCode())
                .testCases(req.testCases())
                .difficultyTags(req.difficultyTags())
                .generatedAt(Instant.now())
                .build();

        return repo.save(test);
    }
}
