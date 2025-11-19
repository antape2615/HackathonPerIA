package com.testia.infraestructure.adapter.out.db.adapter;

import com.testia.domain.model.AssignedTest;
import com.testia.domain.port.AssignedTestRepositoryPort;
import com.testia.infraestructure.adapter.out.db.entity.AssignmentEntity;
import com.testia.infraestructure.adapter.out.db.mapper.AssignmentMapper;
import com.testia.infraestructure.adapter.out.db.repository.SpringAssignmentMongoRepo;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
public class AssignedTestRepositoryAdapter implements AssignedTestRepositoryPort {

    private final SpringAssignmentMongoRepo repo;

    public AssignedTestRepositoryAdapter(SpringAssignmentMongoRepo repo) {
        this.repo = repo;
    }

    @Override
    public AssignedTest save(AssignedTest assignment) {
        AssignmentEntity entity = AssignmentMapper.toEntity(assignment);
        AssignmentEntity saved = repo.save(entity);
        return AssignmentMapper.toDomain(saved);
    }

    @Override
    public Optional<AssignedTest> findById(UUID id) {
        return repo.findById(id)
                .map(AssignmentMapper::toDomain);
    }

    @Override
    public List<AssignedTest> findByCandidateEmail(String email) {
        return repo.findByCandidateEmail(email)
                .stream()
                .map(AssignmentMapper::toDomain)
                .toList();
    }

    @Override
    public List<AssignedTest> findByAssignedBy(String email) {
        return repo.findByAssignedBy(email)
                .stream()
                .map(AssignmentMapper::toDomain)
                .toList();
    }

    @Override
    public boolean existsByCandidateEmailAndTestId(String email, UUID testId) {
        return repo.existsByCandidateEmailAndTestId(email, testId);
    }

    @Override
    public void update(AssignedTest assignment) {
        repo.save(AssignmentMapper.toEntity(assignment));
    }

    @Override
    public List<AssignedTest> findAll() {
        return repo.findAll()
                .stream()
                .map(AssignmentMapper::toDomain)
                .toList();
    }

    // 🔥 IMPLEMENTACIÓN REAL DE PAGINACIÓN
    @Override
    public List<AssignedTest> findPaged(int page, int size) {
        return repo.findAll(PageRequest.of(page, size))
                .stream()
                .map(AssignmentMapper::toDomain)
                .toList();
    }

    @Override
    public List<AssignedTest> findByAssignedByPaged(String email, int page, int size) {
        return repo.findByAssignedBy(email, PageRequest.of(page, size))
                .stream()
                .map(AssignmentMapper::toDomain)
                .toList();
    }
}
