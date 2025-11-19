package com.testia.infraestructure.adapter.out.db.repository;

import com.testia.infraestructure.adapter.out.db.entity.EvaluationResultEntity;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Collection;
import java.util.List;
import java.util.Set;

public interface SpringEvaluationMongoRepo extends MongoRepository<EvaluationResultEntity, String> {
    List<EvaluationResultEntity> findByIdIn(Set<String> stringIds);
}
