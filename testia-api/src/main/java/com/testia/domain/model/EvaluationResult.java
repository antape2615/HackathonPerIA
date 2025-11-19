package com.testia.domain.model;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class EvaluationResult {
    private UUID id;
    private UUID assignmentId;

    private double overallScore;
    private List<BucketScore> bucketScores;

    private String bigOTime;
    private String bigOSpace;

    private int lineCount;

    private List<String> edgeCaseCoverage;
    private List<String> securityNotes;

    private String globalSummary;

    private Instant evaluatedAt;
}

