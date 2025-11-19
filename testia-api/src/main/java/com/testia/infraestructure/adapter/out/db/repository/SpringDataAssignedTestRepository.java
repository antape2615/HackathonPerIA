package com.testia.infraestructure.adapter.out.db.repository;

import com.testia.domain.model.AssignedTest;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.UUID;

public interface SpringDataAssignedTestRepository extends MongoRepository<AssignedTest, UUID> {
    List<AssignedTest> findByCandidateEmail(String email);
    List<AssignedTest> findByStatus(String status);
}

