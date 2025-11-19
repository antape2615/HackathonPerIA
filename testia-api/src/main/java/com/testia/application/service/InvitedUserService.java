package com.testia.application.service;

import com.testia.domain.model.User;
import com.testia.domain.port.UserRepositoryPort;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class InvitedUserService {

    private final UserRepositoryPort userRepo;

    public InvitedUserService(UserRepositoryPort userRepo) {
        this.userRepo = userRepo;
    }

    /**
     * Si el usuario existe, lo retorna.
     * Si NO existe, crea uno nuevo con rol CANDIDATE y estado "invited".
     */
    public User getOrCreateInvitedCandidate(String email) {

        return userRepo.findByEmail(email)
                .orElseGet(() -> {

                    User invited = User.builder()
                            .id(UUID.randomUUID())
                            .email(email)
                            .passwordHash(null)      // no tiene contraseña aún
                            .role(User.Role.CANDIDATE)
                            .invited(true)            // marca de usuario invitado
                            .build();

                    return userRepo.save(invited);
                });
    }
}
