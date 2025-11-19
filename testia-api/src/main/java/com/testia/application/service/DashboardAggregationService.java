package com.testia.application.service;

import com.testia.application.dto.DashboardAssignmentExtendedResponse;
import com.testia.domain.model.*;
import com.testia.domain.port.*;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.*;

@Service
public class DashboardAggregationService {

    private final AssignedTestRepositoryPort assignmentRepo;
    private final GeneratedTestRepositoryPort testRepo;
    private final CandidateSubmissionRepositoryPort submissionRepo;
    private final EvaluationResultRepositoryPort evalRepo;
    private final UserRepositoryPort userRepo;
    private final GetCurrentUserService currentUserService;

    public DashboardAggregationService(
            AssignedTestRepositoryPort assignmentRepo,
            GeneratedTestRepositoryPort testRepo,
            CandidateSubmissionRepositoryPort submissionRepo,
            EvaluationResultRepositoryPort evalRepo,
            UserRepositoryPort userRepo,
            GetCurrentUserService currentUserService
    ) {
        this.assignmentRepo = assignmentRepo;
        this.testRepo = testRepo;
        this.submissionRepo = submissionRepo;
        this.evalRepo = evalRepo;
        this.userRepo = userRepo;
        this.currentUserService = currentUserService;
    }

    // ------------------------------------------------------
    // LISTA EXTENDIDA (SIN N+1)
    // ------------------------------------------------------
    public List<DashboardAssignmentExtendedResponse> getExtendedAssignments(int page, int size) {

        String email = currentUserService.getCurrentUserEmail();
        String role = currentUserService.getCurrentUserRole();

        List<AssignedTest> assignments =
                switch (role) {
                    case "ROLE_ADMIN" -> assignmentRepo.findPaged(page, size);
                    case "ROLE_RECRUITER" -> assignmentRepo.findByAssignedByPaged(email, page, size);
                    default -> List.of();
                };

        // Preload all IDs
        Set<UUID> testIds = new HashSet<>();
        Set<UUID> assignmentIds = new HashSet<>();
        Set<String> candidateEmails = new HashSet<>();

        for (AssignedTest a : assignments) {
            testIds.add(a.getTestId());
            assignmentIds.add(a.getId());
            candidateEmails.add(a.getCandidateEmail());
        }

        // Bulk load
        Map<UUID, GeneratedTest> tests = testRepo.findAllByIdMap(testIds);
        Map<UUID, CandidateSubmission> submissions = submissionRepo.findAllByAssignmentIdMap(assignmentIds);
        Map<UUID, EvaluationResult> evaluations = evalRepo.findAllByAssignmentIdsMap(assignmentIds);
        Map<String, User> candidates = userRepo.findAllByEmailMap(candidateEmails);

        // Build responses
        List<DashboardAssignmentExtendedResponse> responses = new ArrayList<>();

        for (AssignedTest a : assignments) {

            GeneratedTest test = tests.get(a.getTestId());
            CandidateSubmission sub = submissions.get(a.getId());
            EvaluationResult eval = evaluations.get(a.getId());
            User candidate = candidates.get(a.getCandidateEmail());

            Long timeToSubmit = null;
            if (a.getSubmittedAt() != null) {
                timeToSubmit = Duration.between(a.getAssignedAt(), a.getSubmittedAt()).toMinutes();
            }

            responses.add(new DashboardAssignmentExtendedResponse(
                    a.getId().toString(),
                    a.getCandidateEmail(),
                    candidate != null ? candidate.getFullName() : null,
                    a.getTestId().toString(),
                    test != null ? test.getLanguage() : null,
                    test != null ? test.getLevel() : null,
                    test != null ? test.getProblemStatement() : null,
                    test != null ? test.getTestCases().size() : 0,
                    test != null ? test.getTestCases() : null,
                    sub != null ? sub.getSubmittedCode() : null,
                    sub != null ? sub.getSubmittedAt() : null,
                    eval != null ? eval.getOverallScore() : null,
                    eval != null ? eval.getBucketScores() : null,
                    eval != null ? eval.getBigOTime() : null,
                    eval != null ? eval.getBigOSpace() : null,
                    eval != null ? eval.getLineCount() : null,
                    eval != null ? eval.getEdgeCaseCoverage() : null,
                    eval != null ? eval.getSecurityNotes() : null,
                    eval != null ? eval.getGlobalSummary() : null,
                    a.getAssignedAt(),
                    a.getAssignedBy(),
                    timeToSubmit
            ));
        }

        return responses;
    }
}
