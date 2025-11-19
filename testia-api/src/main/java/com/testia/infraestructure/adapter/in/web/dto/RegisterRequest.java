package com.testia.infraestructure.adapter.in.web.dto;

import lombok.Getter;
import lombok.Setter;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Getter @Setter
public class RegisterRequest {
    @Email @NotBlank
    private String email;

    @NotBlank
    private String password;
}