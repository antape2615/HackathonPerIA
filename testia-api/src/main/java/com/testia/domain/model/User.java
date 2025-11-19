package com.testia.domain.model;

import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.UUID;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "users")
public class User {

    private UUID id;
    private String email;
    private String passwordHash;
    private Role role;
    private boolean invited;
    private String fullName;

    public enum Role {
        RECRUITER, ADMIN, CANDIDATE
    }
}
