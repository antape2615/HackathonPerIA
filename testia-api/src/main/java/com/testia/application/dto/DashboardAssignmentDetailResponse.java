package com.testia.application.dto;

import com.testia.domain.model.AssignedTest;
import com.testia.domain.model.GeneratedTest;
import com.testia.domain.model.User;

public record DashboardAssignmentDetailResponse(
        AssignedTest assignment,
        GeneratedTest test,
        User candidate
) {}
