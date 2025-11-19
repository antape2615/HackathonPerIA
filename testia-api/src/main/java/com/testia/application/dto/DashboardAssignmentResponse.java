package com.testia.application.dto;

import java.time.Instant;

public record DashboardAssignmentResponse(
        String assignmentId,
        String candidateEmail,
        String assignedBy,
        Instant assignedAt,
        String status,
        Instant submittedAt,
        String language,
        String seniority
) {}
