package com.testia.infraestructure.adapter.in.web;

import com.testia.application.service.TestGenerationService;
import com.testia.application.service.TestAssignmentService;
import com.testia.domain.model.AssignedTest;
import com.testia.domain.model.GeneratedTest;
import com.testia.infraestructure.adapter.in.web.dto.GenerateTestRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/tests")
public class TestController {

    private final TestGenerationService generationService;
    private final TestAssignmentService assignmentService;

    public TestController(TestGenerationService generationService,
                          TestAssignmentService assignmentService) {
        this.generationService = generationService;
        this.assignmentService = assignmentService;
    }

    @PostMapping("/generate")
    public ResponseEntity<GeneratedTest> generate(@RequestBody GenerateTestRequest req) {
        System.out.println(req.language() +":"+ req.seniority());
        GeneratedTest test = generationService.generateTest(req.language(), req.seniority());
        return ResponseEntity.ok(test);
    }

    @GetMapping("/assigned")
    public ResponseEntity<List<AssignedTest>> getAssignments() {
        return ResponseEntity.ok(assignmentService.getAssignmentsForCurrentUser());
    }
}
