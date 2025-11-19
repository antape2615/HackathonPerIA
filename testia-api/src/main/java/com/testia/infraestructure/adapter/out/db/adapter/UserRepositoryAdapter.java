package com.testia.infraestructure.adapter.out.db.adapter;

import com.testia.domain.model.User;
import com.testia.domain.port.UserRepositoryPort;
import com.testia.infraestructure.adapter.out.db.entity.UserEntity;
import com.testia.infraestructure.adapter.out.db.mapper.UserMapper;
import com.testia.infraestructure.adapter.out.db.repository.SpringDataUserRepository;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class UserRepositoryAdapter implements UserRepositoryPort {

    private final SpringDataUserRepository repository;

    public UserRepositoryAdapter(SpringDataUserRepository repository) {
        this.repository = repository;
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return repository.findByEmail(email)
                .map(UserMapper::toDomain);
    }

    @Override
    public Optional<User> findById(UUID id) {
        return repository.findById(id)
                .map(UserMapper::toDomain); // ✅ Convertimos Entity → Domain
    }

    @Override
    public void update(User user) {
        repository.save(UserMapper.toEntity(user));
    }

    @Override
    public List<User> findAllByEmails(Set<String> emails) {
        if (emails == null || emails.isEmpty()) return List.of();
        return repository.findByEmailIn(emails);
    }

    @Override
    public Map<String, User> findAllByEmailMap(Set<String> emails) {
        return UserRepositoryPort.super.findAllByEmailMap(emails);
    }

    @Override
    public User save(User user) {
        if (user.getId() == null) user.setId(UUID.randomUUID());
        UserEntity saved = repository.save(UserMapper.toEntity(user));
        return UserMapper.toDomain(saved);
    }

}
