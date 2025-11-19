package com.testia.infraestructure.adapter.out.db.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.UUID;

@Data
@Document(collection = "candidate_submissions")
public class CandidateSubmissionEntity {

    @Id
    private UUID id;

    private UUID assignmentId;
    private UUID testId;

    private String submittedCode;
    private Instant submittedAt;

    private String candidateEmail;
}
