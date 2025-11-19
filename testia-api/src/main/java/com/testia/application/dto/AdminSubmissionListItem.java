package com.testia.application.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.Instant;

@Data
@AllArgsConstructor
public class AdminSubmissionListItem {
    private String submissionId;
    private String candidateEmail;
    private String testId;
    private String status;
    private Integer score;
    private Instant submittedAt;
}
