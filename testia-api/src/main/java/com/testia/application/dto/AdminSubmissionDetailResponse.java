package com.testia.application.dto;

import com.testia.domain.model.BucketScore;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.Instant;
import java.util.List;

@Data
@AllArgsConstructor
public class AdminSubmissionDetailResponse {
    private String submissionId;
    private String assignmentId;     // 🔥 New
    private String candidateEmail;
    private String testId;
    private String submittedCode;
    private Instant submittedAt;
    private int overallScore;
    private List<BucketScore> bucketScores;
    private String bigOTime;
    private String bigOSpace;
    private int lineCount;
    private List<String> edgeCaseCoverage;
    private List<String> securityNotes;
    private String globalSummary;
    private Instant evaluatedAt;
}
