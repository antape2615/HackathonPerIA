package com.testia.infraestructure.adapter.out.db.mapper;

import com.testia.domain.model.EvaluationResult;
import com.testia.infraestructure.adapter.out.db.entity.EvaluationResultEntity;

import java.util.UUID;

public class EvaluationMapper {

    public static EvaluationResultEntity toEntity(EvaluationResult result, String id, UUID assignmentId) {

        EvaluationResultEntity e = new EvaluationResultEntity();

        // ID DEL DOCUMENTO = assignmentId
        e.setId(id);
        e.setAssignmentId(assignmentId);

        e.setOverallScore(result.getOverallScore());
        e.setBucketScores(result.getBucketScores());
        e.setBigOTime(result.getBigOTime());
        e.setBigOSpace(result.getBigOSpace());
        e.setLineCount(result.getLineCount());
        e.setEdgeCaseCoverage(result.getEdgeCaseCoverage());
        e.setSecurityNotes(result.getSecurityNotes());
        e.setGlobalSummary(result.getGlobalSummary());
        e.setEvaluatedAt(java.time.Instant.now());

        return e;
    }

    public static EvaluationResult toDomain(EvaluationResultEntity e) {
        return EvaluationResult.builder()
                .id(UUID.fromString(e.getId()))          // ← 🔥 AHORA SÍ
                .assignmentId(e.getAssignmentId())
                .overallScore(e.getOverallScore())
                .bucketScores(e.getBucketScores())
                .bigOTime(e.getBigOTime())
                .bigOSpace(e.getBigOSpace())
                .lineCount(e.getLineCount())
                .edgeCaseCoverage(e.getEdgeCaseCoverage())
                .securityNotes(e.getSecurityNotes())
                .globalSummary(e.getGlobalSummary())
                .evaluatedAt(e.getEvaluatedAt())         // ← 🔥 AHORA SÍ
                .build();
    }
}
