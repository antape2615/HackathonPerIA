package com.testia.infraestructure.adapter.out.db.repository;

import com.testia.domain.model.GeneratedTestEntity;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface GeneratedTestRepository
        extends MongoRepository<GeneratedTestEntity, String> {}
