package com.testia.application.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class AiEvaluationResponse {

    private double overallScore;
    private List<BucketDto> bucketScores;

    private String bigOTime;
    private String bigOSpace;
    private int lineCount;

    private List<String> edgeCaseCoverage;
    private List<String> securityNotes;

    private String globalSummary;

    @Data
    @Builder
    public static class BucketDto {
        private String bucketName;
        private double score;
    }
}
