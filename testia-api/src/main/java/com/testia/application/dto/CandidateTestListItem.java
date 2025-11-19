package com.testia.application.dto;

public record CandidateTestListItem(
        String id,
        String language,
        String level,
        String title,
        String status,
        String assignedDate,
        Integer duration,
        String problemSummary,
        Integer testCaseCount
) {}

