package com.testia.infraestructure.adapter.out.db.repository;

import com.testia.domain.model.User;
import com.testia.infraestructure.adapter.out.db.entity.UserEntity;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

public interface SpringDataUserRepository extends MongoRepository<UserEntity, UUID> {
    Optional<UserEntity> findByEmail(String email);
    Optional<UserEntity> findById(UUID id);
    UserEntity save(UserEntity entity);

    List<User> findByEmailIn(Set<String> emails);
}
