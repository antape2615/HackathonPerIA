package com.testia.infraestructure.adapter.in.web;

import com.testia.application.service.BatchTestGenerationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/tests")
public class TestBatchController {

    private final BatchTestGenerationService batchService;

    public TestBatchController(BatchTestGenerationService batchService) {
        this.batchService = batchService;
    }

    @PostMapping("/generate/batch")
    public ResponseEntity<?> generateBatch(@RequestBody GenerateRequest req) {
        return ResponseEntity.ok(
                Map.of("tests", batchService.generateBatch(req.language(), req.seniority()))
        );
    }

    record GenerateRequest(String language, String seniority) {}
}
