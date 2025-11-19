package com.testia.infraestructure.adapter.out.db.repository;

import com.testia.domain.model.GeneratedTest;
import com.testia.infraestructure.adapter.out.db.entity.GeneratedTestEntity;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Set;
import java.util.UUID;

public interface SpringDataGeneratedTestRepository extends MongoRepository<GeneratedTestEntity, UUID> {
    List<GeneratedTest> findByIdIn(Set<UUID> ids);
}