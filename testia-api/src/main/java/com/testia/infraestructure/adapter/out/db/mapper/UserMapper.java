package com.testia.infraestructure.adapter.out.db.mapper;

import com.testia.domain.model.User;
import com.testia.infraestructure.adapter.out.db.entity.UserEntity;

import java.util.UUID;

public class UserMapper {

    public static User toDomain(UserEntity entity) {
        return User.builder()
                .id(entity.getId())
                .email(entity.getEmail())
                .passwordHash(entity.getPasswordHash())
                .role(User.Role.valueOf(entity.getRole()))
                .invited(entity.isInvited())
                .build();
    }

    public static UserEntity toEntity(User user) {
        return UserEntity.builder()
                .id(user.getId())
                .email(user.getEmail())
                .passwordHash(user.getPasswordHash() == null ? null : user.getPasswordHash())
                .role(user.getRole().name())
                .invited(user.isInvited())
                .build();
    }
}