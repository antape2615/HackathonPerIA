package com.testia.application.service;

import com.testia.domain.exception.DomainException;
import com.testia.domain.model.User;
import com.testia.domain.port.UserRepositoryPort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class AdminUserService {

    private final UserRepositoryPort userRepo;

    public AdminUserService(UserRepositoryPort userRepo) {
        this.userRepo = userRepo;
    }

    public User updateUserRole(UUID userId, String newRole) {

        // validar rol
        User.Role parsedRole;
        try {
            parsedRole = User.Role.valueOf(newRole.toUpperCase());
        } catch (Exception ex) {
            throw new DomainException("Invalid role: " + newRole, HttpStatus.BAD_REQUEST);
        }

        // obtener usuario
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new DomainException("User not found", HttpStatus.NOT_FOUND));

        // actualizar rol
        user.setRole(parsedRole);

        // guardar
        userRepo.update(user);

        return user;
    }

    public User createInvitedCandidateIfNotExists(String email) {

        return userRepo.findByEmail(email)
                .orElseGet(() -> {
                    User newUser = User.builder()
                            .id(UUID.randomUUID())
                            .email(email)
                            .passwordHash(null) // se activará después
                            .role(User.Role.CANDIDATE)
                            .invited(true)
                            .build();

                    return userRepo.save(newUser);
                });
    }

}
