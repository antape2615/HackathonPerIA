package com.testia.infraestructure.adapter.out.db.mapper;

import com.testia.domain.model.CandidateSubmission;
import com.testia.infraestructure.adapter.out.db.entity.CandidateSubmissionEntity;

import java.util.UUID;

public class CandidateSubmissionMapper {

    public static CandidateSubmissionEntity toEntity(CandidateSubmission sub) {
        CandidateSubmissionEntity e = new CandidateSubmissionEntity();

        // si viene sin id desde dominio, generamos uno nuevo
        e.setId(sub.getId() != null ? sub.getId() : UUID.randomUUID());

        e.setAssignmentId(sub.getAssignmentId());
        e.setTestId(sub.getTestId());
        e.setCandidateEmail(sub.getCandidateEmail());
        e.setSubmittedCode(sub.getSubmittedCode());
        e.setSubmittedAt(sub.getSubmittedAt());
        return e;
    }

    public static CandidateSubmission toDomain(CandidateSubmissionEntity e) {
        return CandidateSubmission.builder()
                .id(e.getId())
                .assignmentId(e.getAssignmentId())
                .testId(e.getTestId())
                .candidateEmail(e.getCandidateEmail())
                .submittedCode(e.getSubmittedCode())
                .submittedAt(e.getSubmittedAt())
                .build();
    }
}
