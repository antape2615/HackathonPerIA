package com.testia.infraestructure.adapter.in.web;

import com.testia.application.dto.CandidateTestListItem;
import com.testia.application.service.CandidateAggregationService;
import com.testia.application.service.CandidateTestService;
import com.testia.application.service.TestAssignmentService;
import com.testia.domain.model.AssignedTest;
import com.testia.infraestructure.adapter.in.web.dto.CandidateTestResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/candidate")
public class CandidateTestController {

    private final CandidateTestService candidateTestService;
    private final TestAssignmentService assignmentService;
    private final CandidateAggregationService candidateAggregationService;
    public CandidateTestController(
            CandidateTestService candidateTestService,
            TestAssignmentService assignmentService, CandidateAggregationService candidateAggregationService
    ) {
        this.candidateTestService = candidateTestService;
        this.assignmentService = assignmentService;
        this.candidateAggregationService = candidateAggregationService;
    }

    // 🔹 Listar TODAS las pruebas asignadas al usuario actual (CANDIDATE)
    @GetMapping("/tests")
    public ResponseEntity<List<AssignedTest>> getMyAssignments() {
        return ResponseEntity.ok(assignmentService.getAssignmentsForCurrentUser());
    }

    // 🔹 Obtener los datos completos de una prueba concreta
    @GetMapping("/test/{assignmentId}")
    public ResponseEntity<CandidateTestResponse> getTest(@PathVariable UUID assignmentId) {
        return ResponseEntity.ok(candidateTestService.getCandidateTest(assignmentId));
    }


    // DTO para submit
    public record SubmitRequest(String code) {}

    // 🔹 Enviar solución
    @PostMapping("/test/submit")
    public ResponseEntity<String> submit(
            @RequestParam("id") UUID assignmentId,
            @RequestBody SubmitRequest req
    ) {
        candidateTestService.submitCandidateSolution(assignmentId, req.code());
        return ResponseEntity.ok("Solution submitted!");
    }

    // 🔹 Obtener los datos completos de una prueba concreta
    @GetMapping("/tests/full")
    public ResponseEntity<List<CandidateTestListItem>> getCandidateTests() {
        return ResponseEntity.ok(candidateAggregationService.getCandidateTests());
    }
}
