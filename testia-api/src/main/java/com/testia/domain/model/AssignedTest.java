package com.testia.domain.model;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
public class AssignedTest {

    private UUID id;
    private String candidateEmail;
    private UUID testId;
    private Instant assignedAt;

    private AssignedTestStatus status;
    private String submittedCode;
    private Instant submittedAt;
    private String assignedBy;

    // -------------------------
    // Factory method
    // -------------------------
    public static AssignedTest create(String candidateEmail, String testId) {
        return AssignedTest.builder()
                .id(UUID.randomUUID())
                .candidateEmail(candidateEmail)
                .testId(UUID.fromString(testId))
                .assignedAt(Instant.now())
                .status(AssignedTestStatus.PENDING)
                .submittedCode(null)
                .submittedAt(null)
                .build();
    }
}
