package com.testia.application.dto;

import com.testia.domain.model.TestCase;
import java.util.List;

public record CreateTestRequest(
        String language,
        String level,
        String problemStatement,
        String starterCode,
        List<TestCase> testCases,
        List<String> difficultyTags
) {}
