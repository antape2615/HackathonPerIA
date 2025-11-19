package com.testia.domain.model;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder(toBuilder = true)
public class CandidateSubmission {

    private UUID id;              // Unique ID of submission
    private UUID assignmentId;    // Reference to AssignedTest
    private UUID testId;          // Reference to GeneratedTest

    private String candidateEmail;
    private String submittedCode;

    private Instant submittedAt;
}
