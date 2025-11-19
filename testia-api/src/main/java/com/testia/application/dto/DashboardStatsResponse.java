package com.testia.application.dto;

public record DashboardStatsResponse(
        long total,
        long sent,
        long submitted,
        double completionRate
) {}
