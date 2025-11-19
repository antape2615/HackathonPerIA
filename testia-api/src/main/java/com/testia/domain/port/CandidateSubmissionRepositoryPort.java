package com.testia.domain.port;


import com.testia.domain.model.CandidateSubmission;
import com.testia.infraestructure.adapter.out.db.entity.CandidateSubmissionEntity;

import java.util.*;

public interface CandidateSubmissionRepositoryPort {

    CandidateSubmission save(CandidateSubmission submission);

    Optional<CandidateSubmission> findByAssignmentId(UUID assignmentId);

    // BULK ↓↓↓
    List<CandidateSubmission> findAllByAssignmentIds(Set<UUID> assignmentIds);

    default Map<UUID, CandidateSubmission> findAllByAssignmentIdMap(Set<UUID> ids) {
        Map<UUID, CandidateSubmission> map = new HashMap<>();
        for (CandidateSubmission s : findAllByAssignmentIds(ids)) {
            map.put(s.getAssignmentId(), s);
        }
        return map;
    }

    List<CandidateSubmissionEntity> findAll();
}
