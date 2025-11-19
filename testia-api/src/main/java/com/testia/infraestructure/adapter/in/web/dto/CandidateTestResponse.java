package com.testia.infraestructure.adapter.in.web.dto;

import com.testia.domain.model.TestCase;
import java.util.List;
import java.util.UUID;

public record CandidateTestResponse(
        UUID assignmentId,
        String testId,
        String language,
        String level,
        String title,
        String description,
        String starterCode,
        List<TestCase> testCases,
        Integer duration
) {}

