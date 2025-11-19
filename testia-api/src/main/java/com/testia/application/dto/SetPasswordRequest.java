package com.testia.application.dto;

public record SetPasswordRequest(
        String email,
        String password
) {}
