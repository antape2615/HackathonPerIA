package com.testia.infraestructure.adapter.in.web;

import com.testia.application.dto.AssignGeneratedTestRequest;
import com.testia.application.service.TestAssignmentService;
import com.testia.domain.model.AssignedTest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/tests")
public class TestAssignmentController {

    private final TestAssignmentService assignmentService;

    public TestAssignmentController(TestAssignmentService assignmentService) {
        this.assignmentService = assignmentService;
    }

    @PostMapping("/assign")
    public ResponseEntity<AssignedTest> assign(@RequestBody AssignGeneratedTestRequest req) {
        AssignedTest assigned = assignmentService.assignEphemeralTest(
                req.test(),
                req.candidateEmail()
        );

        return ResponseEntity.ok(assigned);
    }
}
