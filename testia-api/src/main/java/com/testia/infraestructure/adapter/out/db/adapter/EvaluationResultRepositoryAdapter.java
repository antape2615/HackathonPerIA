package com.testia.infraestructure.adapter.out.db.adapter;

import com.testia.domain.model.EvaluationResult;
import com.testia.domain.port.EvaluationResultRepositoryPort;
import com.testia.infraestructure.adapter.out.db.entity.EvaluationResultEntity;
import com.testia.infraestructure.adapter.out.db.mapper.EvaluationMapper;
import com.testia.infraestructure.adapter.out.db.repository.SpringEvaluationMongoRepo;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;

@Component
public class EvaluationResultRepositoryAdapter implements EvaluationResultRepositoryPort {

    private final SpringEvaluationMongoRepo repo;

    public EvaluationResultRepositoryAdapter(SpringEvaluationMongoRepo repo) {
        this.repo = repo;
    }

    @Override
    public void save(UUID assignmentId, EvaluationResult result) {

        EvaluationResultEntity entity = EvaluationMapper.toEntity(
                result,
                assignmentId.toString(), // ID del documento = assignmentId
                assignmentId
        );

        repo.save(entity);
    }

    @Override
    public Optional<EvaluationResult> findByAssignmentId(UUID assignmentId) {
        return repo.findById(assignmentId.toString())
                .map(EvaluationMapper::toDomain);
    }

    @Override
    public void deleteById(UUID assignmentId) {
        repo.deleteById(String.valueOf(assignmentId));
    }

    @Override
    public List<EvaluationResult> findAllByAssignmentIds(Set<UUID> ids) {

        if (ids == null || ids.isEmpty()) return List.of();

        Set<String> stringIds = ids.stream()
                .map(UUID::toString)
                .collect(Collectors.toSet());

        List<EvaluationResultEntity> entities = repo.findByIdIn(stringIds);

        return entities.stream()
                .map(EvaluationMapper::toDomain)
                .toList();
    }
}
