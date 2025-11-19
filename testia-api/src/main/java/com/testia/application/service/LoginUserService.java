package com.testia.application.service;

import com.testia.domain.exception.DomainException;
import com.testia.domain.model.User;
import com.testia.domain.port.UserRepositoryPort;
import com.testia.infraestructure.adapter.in.web.dto.LoginResponse;
import com.testia.infraestructure.adapter.out.jwt.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class LoginUserService {

    private final UserRepositoryPort userRepo;
    private final Argon2PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public LoginUserService(UserRepositoryPort userRepo, Argon2PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public LoginResponse login(String email, String plainPassword) {

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new DomainException("User not found", HttpStatus.CONFLICT));

        if (!passwordEncoder.matches(plainPassword, user.getPasswordHash())) {
            throw new DomainException("Invalid credentials",HttpStatus.CONFLICT);
        }

        String token = jwtService.generateToken(
                user.getId().toString(),
                user.getEmail(),
                user.getRole().name()
        );

        return new LoginResponse(
                token,
                user.getId(),
                user.getEmail(),
                user.getRole().name()
        );
    }
}