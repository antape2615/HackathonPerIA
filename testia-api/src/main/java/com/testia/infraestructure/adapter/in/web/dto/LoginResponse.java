package com.testia.infraestructure.adapter.in.web.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.UUID;

@Getter
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private UUID id;
    private String email;
    private String role;
}
