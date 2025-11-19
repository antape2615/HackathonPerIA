package com.testia.infraestructure.adapter.out.db.mapper;

import com.testia.domain.model.AssignedTest;
import com.testia.infraestructure.adapter.out.db.entity.AssignmentEntity;

public class AssignmentMapper {

    public static AssignmentEntity toEntity(AssignedTest domain) {

        AssignmentEntity e = new AssignmentEntity();

        e.setId(domain.getId());
        e.setCandidateEmail(domain.getCandidateEmail());
        e.setTestId(domain.getTestId());
        e.setAssignedAt(domain.getAssignedAt());

        // ✔ status es AssignedTestStatus (enum), lo ponemos directo
        e.setStatus(domain.getStatus());

        e.setSubmittedCode(domain.getSubmittedCode());
        e.setSubmittedAt(domain.getSubmittedAt());

        e.setAssignedBy(domain.getAssignedBy());

        return e;
    }

    public static AssignedTest toDomain(AssignmentEntity e) {

        return AssignedTest.builder()
                .id(e.getId())
                .candidateEmail(e.getCandidateEmail())
                .testId(e.getTestId())
                .assignedAt(e.getAssignedAt())

                // ✔ Asignación directa, porque también es enum
                .status(e.getStatus())

                .submittedCode(e.getSubmittedCode())
                .submittedAt(e.getSubmittedAt())

                .assignedBy(e.getAssignedBy())

                .build();
    }
}
