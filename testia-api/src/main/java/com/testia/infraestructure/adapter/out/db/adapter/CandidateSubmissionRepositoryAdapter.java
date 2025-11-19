package com.testia.infraestructure.adapter.out.db.adapter;

import com.testia.domain.model.CandidateSubmission;
import com.testia.domain.port.CandidateSubmissionRepositoryPort;
import com.testia.infraestructure.adapter.out.db.entity.CandidateSubmissionEntity;
import com.testia.infraestructure.adapter.out.db.mapper.CandidateSubmissionMapper;
import com.testia.infraestructure.adapter.out.db.repository.SpringDataCandidateSubmissionRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Component
public class CandidateSubmissionRepositoryAdapter implements CandidateSubmissionRepositoryPort {

    private final SpringDataCandidateSubmissionRepository repo;

    public CandidateSubmissionRepositoryAdapter(SpringDataCandidateSubmissionRepository repo) {
        this.repo = repo;
    }

    @Override
    public CandidateSubmission save(CandidateSubmission submission) {
        CandidateSubmissionEntity entity = CandidateSubmissionMapper.toEntity(submission);
        return CandidateSubmissionMapper.toDomain(repo.save(entity));
    }

    @Override
    public Optional<CandidateSubmission> findByAssignmentId(UUID assignmentId) {
        return repo.findByAssignmentId(assignmentId)
                .map(CandidateSubmissionMapper::toDomain);
    }

    @Override
    public List<CandidateSubmission> findAllByAssignmentIds(Set<UUID> assignmentIds) {
        if (assignmentIds == null || assignmentIds.isEmpty()) return List.of();

        return repo.findByAssignmentIdIn(assignmentIds).stream()
                .map(CandidateSubmissionMapper::toDomain)
                .toList();
    }

    // Este lo dejamos devolviendo entities porque tu SubmissionQueryService lo usa así
    @Override
    public List<CandidateSubmissionEntity> findAll() {
        return repo.findAll();
    }
}
