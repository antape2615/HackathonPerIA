package com.testia.infraestructure.adapter.out.db.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.UUID;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "users")
public class UserEntity {

    @Id
    private UUID id;
    private String email;
    private String passwordHash;
    private String role;
    private boolean invited;
}

