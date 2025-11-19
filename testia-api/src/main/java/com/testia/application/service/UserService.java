package com.testia.application.service;

import com.testia.domain.exception.DomainException;
import com.testia.domain.model.User;
import com.testia.domain.port.UserRepositoryPort;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepositoryPort userRepo;
    private final Argon2PasswordEncoder passwordEncoder;

    public UserService(UserRepositoryPort userRepo, Argon2PasswordEncoder passwordEncoder) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
    }

    public void setPasswordForInvitedUser(String email, String rawPassword) {

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new DomainException("User not found", HttpStatus.NOT_FOUND));

        if (!user.isInvited()) {
            throw new DomainException("User already has a password", HttpStatus.BAD_REQUEST);
        }

        if (rawPassword == null || rawPassword.length() < 6) {
            throw new DomainException("Password must be at least 6 characters", HttpStatus.BAD_REQUEST);
        }

        String hashed = passwordEncoder.encode(rawPassword);

        user.setPasswordHash(hashed);
        user.setInvited(false);

        // 🔥 IMPORTANTE: usa save() SIEMPRE
        userRepo.save(user);
    }

}
