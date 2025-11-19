package com.testia.application.service;

import com.testia.application.dto.AdminSubmissionDetailResponse;
import com.testia.application.dto.AdminSubmissionListItem;
import com.testia.domain.exception.DomainException;
import com.testia.domain.model.AssignedTest;
import com.testia.domain.model.CandidateSubmission;
import com.testia.domain.model.EvaluationResult;
import com.testia.domain.port.AssignedTestRepositoryPort;
import com.testia.domain.port.CandidateSubmissionRepositoryPort;
import com.testia.domain.port.EvaluationResultRepositoryPort;
import com.testia.infraestructure.adapter.out.db.entity.CandidateSubmissionEntity;
import com.testia.infraestructure.adapter.out.db.mapper.CandidateSubmissionMapper;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class SubmissionQueryService {

    private final CandidateSubmissionRepositoryPort submissionRepo;
    private final AssignedTestRepositoryPort assignmentRepo;
    private final EvaluationResultRepositoryPort evalRepo;

    public SubmissionQueryService(
            CandidateSubmissionRepositoryPort submissionRepo,
            AssignedTestRepositoryPort assignmentRepo,
            EvaluationResultRepositoryPort evalRepo
    ) {
        this.submissionRepo = submissionRepo;
        this.assignmentRepo = assignmentRepo;
        this.evalRepo = evalRepo;
    }

    // --------------------------------------------------------
    // LISTAR SUBMISSIONS (tabla admin)
    // --------------------------------------------------------
    public List<AdminSubmissionListItem> getAllSubmissions() {

        List<CandidateSubmissionEntity> entities = submissionRepo.findAll();

        return entities.stream().map(entity -> {

            CandidateSubmission submission = CandidateSubmissionMapper.toDomain(entity);

            AssignedTest assignment =
                    assignmentRepo.findById(submission.getAssignmentId()).orElse(null);

            EvaluationResult eval =
                    evalRepo.findByAssignmentId(submission.getAssignmentId()).orElse(null);

            Integer score = eval != null
                    ? (int) Math.round(eval.getOverallScore())
                    : null;

            return new AdminSubmissionListItem(
                    submission.getAssignmentId().toString(),   // 🔥 ID REAL QUE DEBE IR AL DETALLE
                    submission.getCandidateEmail(),
                    assignment != null ? assignment.getTestId().toString() : null,
                    eval != null ? "COMPLETED" : "SUBMITTED",
                    score,
                    submission.getSubmittedAt()
            );

        }).collect(Collectors.toList());
    }

    // --------------------------------------------------------
    // DETALLE (POR assignmentId)
    // --------------------------------------------------------
    public AdminSubmissionDetailResponse getSubmissionDetails(String assignmentId) {

        UUID id = UUID.fromString(assignmentId);

        AssignedTest assignment = assignmentRepo.findById(id)
                .orElseThrow(() -> new DomainException("Assignment not found", HttpStatus.NOT_FOUND));

        CandidateSubmission submission = submissionRepo.findByAssignmentId(id)
                .orElseThrow(() -> new DomainException("Submission not found", HttpStatus.NOT_FOUND));

        EvaluationResult eval = evalRepo.findByAssignmentId(id)
                .orElseThrow(() -> new DomainException("Evaluation not found", HttpStatus.NOT_FOUND));

        return new AdminSubmissionDetailResponse(
                submission.getId().toString(),      // submissionId
                assignment.getId().toString(),      // assignmentId
                submission.getCandidateEmail(),
                assignment.getTestId().toString(),
                submission.getSubmittedCode(),
                submission.getSubmittedAt(),
                (int) Math.round(eval.getOverallScore()),
                eval.getBucketScores(),
                eval.getBigOTime(),
                eval.getBigOSpace(),
                eval.getLineCount(),
                eval.getEdgeCaseCoverage(),
                eval.getSecurityNotes(),
                eval.getGlobalSummary(),
                eval.getEvaluatedAt()
        );
    }
}
