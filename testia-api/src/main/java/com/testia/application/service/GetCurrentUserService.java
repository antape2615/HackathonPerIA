package com.testia.application.service;

import com.testia.domain.exception.DomainException;
import com.testia.domain.model.User;
import com.testia.domain.port.UserRepositoryPort;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class GetCurrentUserService {

    private final UserRepositoryPort userRepo;

    public GetCurrentUserService(UserRepositoryPort userRepo) {
        this.userRepo = userRepo;
    }

    public User getCurrentUser() {
        String userId = extractUserId();
        return userRepo.findById(UUID.fromString(userId))
                .orElseThrow(() -> new DomainException("User not found", HttpStatus.NOT_FOUND));
    }

    public String getCurrentUserEmail() {
        return getCurrentUser().getEmail();
    }

    public String getCurrentUserRole() {
        return "ROLE_" + getCurrentUser().getRole().name();
    }

    private String extractUserId() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || authentication.getPrincipal() == null) {
            throw new DomainException("Missing token", HttpStatus.UNAUTHORIZED);
        }

        return authentication.getPrincipal().toString();  // userId del JWT
    }
}
