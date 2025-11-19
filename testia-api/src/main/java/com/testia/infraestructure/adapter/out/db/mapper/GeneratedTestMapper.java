package com.testia.infraestructure.adapter.out.db.mapper;

import com.testia.domain.model.GeneratedTest;
import com.testia.domain.model.TestCase;
import com.testia.infraestructure.adapter.out.db.entity.GeneratedTestEntity;
import com.testia.infraestructure.adapter.out.db.entity.TestCaseEntity;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class GeneratedTestMapper {

    // 🔹 Convierte del dominio → entidad (para guardar en MongoDB)
    public GeneratedTestEntity toEntity(GeneratedTest test) {
        if (test == null) return null;

        List<TestCaseEntity> testCaseEntities = null;
        if (test.getTestCases() != null) {
            testCaseEntities = test.getTestCases().stream()
                    .map(tc -> TestCaseEntity.builder()
                            .input(tc.getInput())
                            .expectedOutput(tc.getExpectedOutput())
                            .type(tc.getType())
                            .build())
                    .collect(Collectors.toList());
        }

        return GeneratedTestEntity.builder()
                .id(test.getId())
                .language(test.getLanguage())
                .level(test.getLevel())
                .problemStatement(test.getProblemStatement())
                .starterCode(test.getStarterCode())
                .testCases(testCaseEntities)
                .difficultyTags(test.getDifficultyTags())
                .generatedAt(test.getGeneratedAt())
                .build();
    }

    // 🔹 Convierte de entidad → dominio (para devolver al servicio o controlador)
    public GeneratedTest toDomain(GeneratedTestEntity entity) {
        if (entity == null) return null;

        List<TestCase> testCases = null;
        if (entity.getTestCases() != null) {
            testCases = entity.getTestCases().stream()
                    .map(tc -> TestCase.builder()
                            .input(tc.getInput())
                            .expectedOutput(tc.getExpectedOutput())
                            .type(tc.getType())
                            .build())
                    .collect(Collectors.toList());
        }

        return GeneratedTest.builder()
                .id(entity.getId())
                .language(entity.getLanguage())
                .level(entity.getLevel())
                .problemStatement(entity.getProblemStatement())
                .starterCode(entity.getStarterCode())
                .testCases(testCases)
                .difficultyTags(entity.getDifficultyTags())
                .generatedAt(entity.getGeneratedAt())
                .build();
    }
}
