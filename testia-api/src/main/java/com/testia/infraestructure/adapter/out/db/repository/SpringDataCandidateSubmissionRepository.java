package com.testia.infraestructure.adapter.out.db.repository;

import com.testia.domain.model.CandidateSubmission;
import com.testia.infraestructure.adapter.out.db.entity.CandidateSubmissionEntity;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

public interface SpringDataCandidateSubmissionRepository
        extends MongoRepository<CandidateSubmissionEntity, UUID> {

    Optional<CandidateSubmissionEntity> findByAssignmentId(UUID assignmentId);

    List<CandidateSubmissionEntity> findByAssignmentIdIn(Set<UUID> assignmentIds);
}

