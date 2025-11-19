package com.testia.infraestructure.adapter.in.web.dto;

import lombok.Data;

@Data
public class SendAssignmentRequest {
    private String email;
    private String testId;
}