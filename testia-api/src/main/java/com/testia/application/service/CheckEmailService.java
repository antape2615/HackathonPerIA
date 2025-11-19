package com.testia.application.service;

import com.testia.domain.port.UserRepositoryPort;
import org.springframework.stereotype.Service;

@Service
public class CheckEmailService {

    private final UserRepositoryPort userRepo;

    public CheckEmailService(UserRepositoryPort userRepo) {
        this.userRepo = userRepo;
    }

    public boolean emailExists(String email) {
        return userRepo.findByEmail(email).isPresent();
    }
}
