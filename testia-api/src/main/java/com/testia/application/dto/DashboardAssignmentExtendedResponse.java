package com.testia.application.dto;

import com.testia.domain.model.BucketScore;
import com.testia.domain.model.TestCase;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.Instant;
import java.util.List;

@Data
@AllArgsConstructor
public class DashboardAssignmentExtendedResponse {

    private String assignmentId;

    // Candidate info
    private String candidateEmail;
    private String candidateName;

    // Test info
    private String testId;
    private String language;
    private String level;
    private String problemStatement;
    private int testCaseCount;
    private List<TestCase> testCases;

    // Submission info
    private String submittedCode;
    private Instant submittedAt;

    // Evaluation info
    private Double overallScore;
    private List<BucketScore> bucketScores;
    private String bigOTime;
    private String bigOSpace;
    private Integer lineCount;
    private List<String> edgeCaseCoverage;
    private List<String> securityNotes;
    private String globalSummary;

    // Timestamps
    private Instant assignedAt;
    private String assignedBy;

    // Derived KPIs
    private Long timeToSubmitMinutes;
}
