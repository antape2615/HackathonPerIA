package com.testia.infraestructure.adapter.out.db.adapter;

import com.testia.domain.model.GeneratedTest;
import com.testia.domain.model.TestCase;
import com.testia.domain.port.GeneratedTestRepositoryPort;
import com.testia.infraestructure.adapter.out.db.entity.GeneratedTestEntity;
import com.testia.infraestructure.adapter.out.db.entity.TestCaseEntity;
import com.testia.infraestructure.adapter.out.db.repository.SpringDataGeneratedTestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class GeneratedTestRepositoryAdapter implements GeneratedTestRepositoryPort {

    private final SpringDataGeneratedTestRepository repo;

    @Override
    public GeneratedTest save(GeneratedTest test) {

        GeneratedTestEntity entity = new GeneratedTestEntity();
        entity.setId(test.getId() == null ? UUID.randomUUID() : test.getId());
        entity.setLanguage(test.getLanguage());
        entity.setLevel(test.getLevel());
        entity.setProblemStatement(test.getProblemStatement());
        entity.setStarterCode(test.getStarterCode());
        entity.setDifficultyTags(test.getDifficultyTags());
        entity.setGeneratedAt(test.getGeneratedAt());

        entity.setTestCases(
                test.getTestCases().stream().map(tc -> {
                    TestCaseEntity e = new TestCaseEntity();
                    e.setInput(tc.getInput());
                    e.setExpectedOutput(tc.getExpectedOutput());
                    e.setType(tc.getType());
                    return e;
                }).collect(Collectors.toList())
        );

        repo.save(entity);

        return test.toBuilder().id(entity.getId()).build();
    }

    @Override
    public java.util.Optional<GeneratedTest> findById(UUID id) {
        return repo.findById(id).map(entity ->
                GeneratedTest.builder()
                        .id(entity.getId())
                        .language(entity.getLanguage())
                        .level(entity.getLevel())
                        .problemStatement(entity.getProblemStatement())
                        .starterCode(entity.getStarterCode())
                        .generatedAt(entity.getGeneratedAt())
                        .difficultyTags(entity.getDifficultyTags())
                        .testCases(entity.getTestCases().stream().map(e ->
                                TestCase.builder()
                                        .input(e.getInput())
                                        .expectedOutput(e.getExpectedOutput())
                                        .type(e.getType())
                                        .build()
                        ).collect(Collectors.toList()))
                        .build()
        );
    }

    @Override
    public List<GeneratedTest> findAllById(Set<UUID> ids) {
        if (ids == null || ids.isEmpty()) return List.of();
        return repo.findByIdIn(ids);
    }
}
