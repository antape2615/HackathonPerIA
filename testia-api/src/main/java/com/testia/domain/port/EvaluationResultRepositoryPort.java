package com.testia.domain.port;

import com.testia.domain.model.EvaluationResult;

import java.util.*;

public interface EvaluationResultRepositoryPort {

    void save(UUID assignmentId, EvaluationResult result);

    Optional<EvaluationResult> findByAssignmentId(UUID assignmentId);

    void deleteById(UUID assignmentId);   // <-- AHORA UUID

    // BULK ↓↓↓
    List<EvaluationResult> findAllByAssignmentIds(Set<UUID> ids);

    default Map<UUID, EvaluationResult> findAllByAssignmentIdsMap(Set<UUID> ids) {
        Map<UUID, EvaluationResult> map = new HashMap<>();
        for (EvaluationResult r : findAllByAssignmentIds(ids)) {
            map.put(r.getAssignmentId(), r);
        }
        return map;
    }
}
