package com.testia.infraestructure.adapter.out.db.repository;

import com.testia.infraestructure.adapter.out.db.entity.AssignmentEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.UUID;

public interface SpringAssignmentMongoRepo
        extends MongoRepository<AssignmentEntity, UUID> {

    List<AssignmentEntity> findByCandidateEmail(String email);

    // status se guarda como String en Mongo
    List<AssignmentEntity> findByStatus(String status);

    List<AssignmentEntity> findByAssignedBy(String assignedBy);

    Page<AssignmentEntity> findAll(Pageable pageable);

    Page<AssignmentEntity> findByAssignedBy(String email, Pageable pageable);

    boolean existsByCandidateEmailAndTestId(String email, UUID testId);
}
