package com.testia.application.service;

import com.testia.application.dto.*;
import com.testia.domain.model.AssignedTest;
import com.testia.domain.model.AssignedTestStatus;
import com.testia.domain.model.GeneratedTest;
import com.testia.domain.model.User;
import com.testia.domain.port.AssignedTestRepositoryPort;
import com.testia.domain.port.GeneratedTestRepositoryPort;
import com.testia.domain.port.UserRepositoryPort;
import com.testia.domain.exception.DomainException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class DashboardService {

    private final AssignedTestRepositoryPort assignmentRepo;
    private final GeneratedTestRepositoryPort testRepo;
    private final UserRepositoryPort userRepo;
    private final GetCurrentUserService currentUserService;

    public DashboardService(
            AssignedTestRepositoryPort assignmentRepo,
            GeneratedTestRepositoryPort testRepo,
            UserRepositoryPort userRepo,
            GetCurrentUserService currentUserService
    ) {
        this.assignmentRepo = assignmentRepo;
        this.testRepo = testRepo;
        this.userRepo = userRepo;
        this.currentUserService = currentUserService;
    }

    // ---------------------------------------------------------------
    // 1. LISTA PARA DASHBOARD
    // ---------------------------------------------------------------
    public List<DashboardAssignmentResponse> getAssignmentsForDashboard() {

        String email = currentUserService.getCurrentUserEmail();
        String role = currentUserService.getCurrentUserRole();

        List<AssignedTest> assignments;

        switch (role) {
            case "ROLE_ADMIN":
                assignments = assignmentRepo.findAll();
                break;

            case "ROLE_RECRUITER":
                assignments = assignmentRepo.findByAssignedBy(email);
                break;

            default:
                throw new DomainException("Unauthorized dashboard access", HttpStatus.FORBIDDEN);
        }

        return assignments.stream().map(a -> {
            GeneratedTest test = testRepo.findById(a.getTestId()).orElse(null);

            return new DashboardAssignmentResponse(
                    a.getId().toString(),
                    a.getCandidateEmail(),
                    a.getAssignedBy(),
                    a.getAssignedAt(),
                    a.getStatus().name(),
                    a.getSubmittedAt(),
                    test != null ? test.getLanguage() : null,
                    test != null ? test.getLevel() : null
            );
        }).toList();
    }

    // ---------------------------------------------------------------
    // 2. STATS
    // ---------------------------------------------------------------
    // ---------------------------------------------------------------
// 2. STATS
// ---------------------------------------------------------------
    public DashboardStatsResponse getStats() {

        List<AssignedTest> all = assignmentRepo.findAll();

        long total = all.size();
        long sent = all.stream().filter(a -> a.getStatus() == AssignedTestStatus.SENT).count();
        long completed = all.stream().filter(a -> a.getStatus() == AssignedTestStatus.COMPLETED).count();

        double completionRate = total > 0 ? (double) completed / total : 0.0;

        return new DashboardStatsResponse(
                total,
                sent,
                completed,
                completionRate
        );
    }


    // ---------------------------------------------------------------
    // 3. DETALLE COMPLETO POR ID
    // ---------------------------------------------------------------
    public DashboardAssignmentDetailResponse getAssignmentDetail(String id) {

        AssignedTest assignment = assignmentRepo.findById(UUID.fromString(id))
                .orElseThrow(() -> new DomainException("Assignment not found", HttpStatus.NOT_FOUND));

        GeneratedTest test = testRepo.findById(assignment.getTestId())
                .orElseThrow(() -> new DomainException("Test not found", HttpStatus.NOT_FOUND));

        User candidate = userRepo.findByEmail(assignment.getCandidateEmail()).orElse(null);

        return new DashboardAssignmentDetailResponse(
                assignment,
                test,
                candidate
        );
    }

    // ---------------------------------------------------------------
    // 4. Paginacion Dashboard Response
    // ---------------------------------------------------------------
    public List<DashboardAssignmentResponse> getAssignmentsForDashboard(int page, int size) {

        String role = currentUserService.getCurrentUserRole();
        String email = currentUserService.getCurrentUserEmail();

        List<AssignedTest> assignments;

        switch (role) {
            case "ROLE_ADMIN":
                assignments = assignmentRepo.findPaged(page, size);
                break;

            case "ROLE_RECRUITER":
                assignments = assignmentRepo.findByAssignedByPaged(email, page, size);
                break;

            default:
                throw new DomainException("Unauthorized", HttpStatus.FORBIDDEN);
        }

        return assignments.stream().map(a -> {
            GeneratedTest test = testRepo.findById(a.getTestId()).orElse(null);

            return new DashboardAssignmentResponse(
                    a.getId().toString(),
                    a.getCandidateEmail(),
                    a.getAssignedBy(),
                    a.getAssignedAt(),
                    a.getStatus().name(),
                    a.getSubmittedAt(),
                    test != null ? test.getLanguage() : null,
                    test != null ? test.getLevel() : null
            );
        }).toList();
    }

}
