package com.testia.application.service;

import com.testia.domain.exception.DomainException;
import com.testia.domain.model.*;
import com.testia.domain.port.*;
import com.testia.infraestructure.adapter.in.web.dto.CandidateTestResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
public class CandidateTestService {

    private final AssignedTestRepositoryPort assignmentRepo;
    private final GeneratedTestRepositoryPort testRepo;
    private final CandidateSubmissionRepositoryPort submissionRepo;
    private final AiEvaluationPort aiPort;
    private final EvaluationResultRepositoryPort evalRepo;
    private final GetCurrentUserService currentUserService;

    public CandidateTestService(
            AssignedTestRepositoryPort assignmentRepo,
            GeneratedTestRepositoryPort testRepo,
            CandidateSubmissionRepositoryPort submissionRepo,
            AiEvaluationPort aiPort,
            EvaluationResultRepositoryPort evalRepo,
            GetCurrentUserService currentUserService
    ) {
        this.assignmentRepo = assignmentRepo;
        this.testRepo = testRepo;
        this.submissionRepo = submissionRepo;
        this.aiPort = aiPort;
        this.evalRepo = evalRepo;
        this.currentUserService = currentUserService;
    }

    // ============================================================
    // GET TEST FOR CANDIDATE
    // ============================================================
    public CandidateTestResponse getCandidateTest(UUID assignmentId) {

        AssignedTest assignment = assignmentRepo.findById(assignmentId)
                .orElseThrow(() -> new DomainException("Assignment not found", HttpStatus.NOT_FOUND));

        String currentEmail = currentUserService.getCurrentUserEmail();
        if (!assignment.getCandidateEmail().equalsIgnoreCase(currentEmail)) {
            throw new DomainException("You do not own this test", HttpStatus.FORBIDDEN);
        }

        GeneratedTest test = testRepo.findById(assignment.getTestId())
                .orElseThrow(() -> new DomainException("Test not found", HttpStatus.NOT_FOUND));

        // Generate readable title
        String title = test.getLevel().toUpperCase() + " / " + test.getLanguage().toUpperCase();

        return new CandidateTestResponse(
                assignment.getId(),
                test.getId().toString(),
                test.getLanguage(),
                test.getLevel(),
                title,
                test.getProblemStatement(),
                test.getStarterCode(),
                test.getTestCases(),
                60 // default duration
        );
    }

    // ============================================================
    // SUBMIT SOLUTION
    // ============================================================
    public void submitCandidateSolution(UUID assignmentId, String code) {

        if (code == null || code.isBlank()) {
            throw new DomainException("Code cannot be empty", HttpStatus.BAD_REQUEST);
        }

        AssignedTest assignment = assignmentRepo.findById(assignmentId)
                .orElseThrow(() -> new DomainException("Assignment not found", HttpStatus.NOT_FOUND));

        String currentEmail = currentUserService.getCurrentUserEmail();
        if (!assignment.getCandidateEmail().equalsIgnoreCase(currentEmail)) {
            throw new DomainException("No puedes submiter este test (No te pertenece)", HttpStatus.FORBIDDEN);
        }

        // Save submission
        CandidateSubmission submission = CandidateSubmission.builder()
                .id(UUID.randomUUID())
                .assignmentId(assignmentId)
                .testId(assignment.getTestId())
                .candidateEmail(currentEmail)
                .submittedCode(code)
                .submittedAt(Instant.now())
                .build();

        submissionRepo.save(submission);

        // Mark assignment completed
        assignment.setStatus(AssignedTestStatus.COMPLETED);
        assignment.setSubmittedAt(Instant.now());
        assignmentRepo.save(assignment);

        // Load full test for evaluation
        GeneratedTest test = testRepo.findById(assignment.getTestId())
                .orElseThrow(() -> new DomainException("Generated test not found", HttpStatus.NOT_FOUND));

        // Evaluate using AI
        EvaluationResult result = aiPort.evaluate(submission, test);

        // Save evaluation
        evalRepo.save(assignmentId, result);
    }
}
