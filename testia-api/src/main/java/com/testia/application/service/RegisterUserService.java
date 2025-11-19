package com.testia.application.service;

import com.testia.domain.exception.DomainException;
import com.testia.domain.model.User;
import com.testia.domain.port.UserRepositoryPort;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.UUID;

@Service
public class RegisterUserService {

    private final UserRepositoryPort userRepo;
    private final Argon2PasswordEncoder passwordEncoder;

    public RegisterUserService(UserRepositoryPort userRepo, Argon2PasswordEncoder passwordEncoder) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
    }

    public User register(String email, String plainPassword) {

        if (userRepo.findByEmail(email).isPresent()) {
            throw new DomainException("User already exists", HttpStatus.CONFLICT);
        }

        String passwordHash = passwordEncoder.encode(plainPassword);

        User user = User.builder()
                .id(UUID.randomUUID())
                .email(email)
                .passwordHash(passwordHash)
                .role(User.Role.CANDIDATE)
                .invited(false)
                .build();

        return userRepo.save(user);
    }
}

