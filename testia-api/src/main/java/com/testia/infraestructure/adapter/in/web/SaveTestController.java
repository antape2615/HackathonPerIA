package com.testia.infraestructure.adapter.in.web;

import com.testia.application.dto.CreateTestRequest;
import com.testia.application.service.TestPersistService;
import com.testia.domain.model.GeneratedTest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/tests")
public class SaveTestController {

    private final TestPersistService persistService;

    public SaveTestController(TestPersistService persistService) {
        this.persistService = persistService;
    }

    @PostMapping
    public ResponseEntity<GeneratedTest> saveTest(
            @RequestBody CreateTestRequest req
    ) {
        return ResponseEntity.ok(persistService.save(req));
    }
}
