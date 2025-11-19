package com.testia.infraestructure.adapter.out.db.repository;

import com.testia.infraestructure.adapter.out.db.entity.TestBucketEntity;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface SpringDataTestBucketRepository extends MongoRepository<TestBucketEntity, String> {
    List<TestBucketEntity> findByLanguageAndLevelOrderByBucketIdDesc(String language, String level);
}