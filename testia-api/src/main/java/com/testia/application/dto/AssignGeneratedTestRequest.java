package com.testia.application.dto;

import com.testia.domain.model.GeneratedTest;

public record AssignGeneratedTestRequest(
        String candidateEmail,
        GeneratedTest test
) {}
