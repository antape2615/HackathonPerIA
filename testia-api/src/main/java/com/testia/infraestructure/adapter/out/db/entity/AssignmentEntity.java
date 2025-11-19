package com.testia.infraestructure.adapter.out.db.entity;

import com.testia.domain.model.AssignedTestStatus;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.UUID;

@Data
@Document(collection = "assigned_tests")
public class AssignmentEntity {

    @Id
    private UUID id;

    private String candidateEmail;
    private UUID testId;

    private Instant assignedAt;
    private AssignedTestStatus status;

    private String submittedCode;
    private Instant submittedAt;
    private String assignedBy;

}
