package com.testia.infraestructure.adapter.in.web.dto;

import lombok.Data;

@Data
public class AssignmentRequest {
    private String candidateEmail;
    private String testId;
}
