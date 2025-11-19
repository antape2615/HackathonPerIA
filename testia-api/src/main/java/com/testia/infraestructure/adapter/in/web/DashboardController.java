package com.testia.infraestructure.adapter.in.web;

import com.testia.application.dto.DashboardAssignmentDetailResponse;
import com.testia.application.dto.DashboardAssignmentExtendedResponse;
import com.testia.application.dto.DashboardAssignmentResponse;
import com.testia.application.dto.DashboardStatsResponse;
import com.testia.application.service.DashboardAggregationService;
import com.testia.application.service.DashboardService;
import com.testia.domain.model.CandidateSubmission;
import com.testia.domain.model.EvaluationResult;
import com.testia.domain.port.CandidateSubmissionRepositoryPort;
import com.testia.domain.port.EvaluationResultRepositoryPort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;
    private final DashboardAggregationService dashboardAggregationService;
    private final CandidateSubmissionRepositoryPort submissionRepo;
    private final EvaluationResultRepositoryPort evalRepo;

    public DashboardController(
            DashboardService dashboardService,
            DashboardAggregationService dashboardAggregationService,
            CandidateSubmissionRepositoryPort submissionRepo,
            EvaluationResultRepositoryPort evalRepo
    ) {
        this.dashboardService = dashboardService;
        this.dashboardAggregationService = dashboardAggregationService;
        this.submissionRepo = submissionRepo;
        this.evalRepo = evalRepo;
    }

    // ============================================================================
    // 1) LISTA PAGINADA BÁSICA
    // ============================================================================
    @GetMapping("/assignments")
    public ResponseEntity<List<DashboardAssignmentResponse>> getAssignments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(dashboardService.getAssignmentsForDashboard(page, size));
    }

    // ============================================================================
    // 2) LISTA EXTENDIDA (con eval + submission + datos completos)
    // ============================================================================
    @GetMapping("/assignments/extended")
    public ResponseEntity<List<DashboardAssignmentExtendedResponse>> getExtendedAssignments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(dashboardAggregationService.getExtendedAssignments(page, size));
    }

    // ============================================================================
    // 3) ESTADÍSTICAS
    // ============================================================================
    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsResponse> getStats() {
        return ResponseEntity.ok(dashboardService.getStats());
    }

    // ============================================================================
    // 4) DETALLE COMPLETO DE UN ASSIGNMENT
    // ============================================================================
    @GetMapping("/assignment/{id}")
    public ResponseEntity<DashboardAssignmentDetailResponse> getAssignmentDetail(
            @PathVariable String id
    ) {
        return ResponseEntity.ok(dashboardService.getAssignmentDetail(id));
    }

    // ============================================================================
    // 5) OBTENER SUBMISSION DE UN ASSIGNMENT
    // ============================================================================
    @GetMapping("/submission/{assignmentId}")
    public ResponseEntity<CandidateSubmission> getSubmission(
            @PathVariable String assignmentId
    ) {
        UUID id = UUID.fromString(assignmentId);

        return submissionRepo.findByAssignmentId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ============================================================================
    // 6) OBTENER EVALUACIÓN DE UN ASSIGNMENT
    // ============================================================================
    @GetMapping("/evaluation/{assignmentId}")
    public ResponseEntity<EvaluationResult> getEvaluation(
            @PathVariable String assignmentId
    ) {
        UUID id = UUID.fromString(assignmentId);

        return evalRepo.findByAssignmentId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
