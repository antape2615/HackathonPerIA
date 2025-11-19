package com.testia.infraestructure.adapter.in.web;

import com.testia.application.dto.AdminSubmissionDetailResponse;
import com.testia.application.dto.AdminSubmissionListItem;
import com.testia.application.service.AiEvaluationService;
import com.testia.application.service.SubmissionQueryService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/submissions")
public class AdminSubmissionController {

    private final SubmissionQueryService submissionService;
    private final AiEvaluationService aiService;

    public AdminSubmissionController(SubmissionQueryService submissionService, AiEvaluationService aiService) {
        this.submissionService = submissionService;
        this.aiService = aiService;
    }

    @GetMapping
    public List<AdminSubmissionListItem> list() {
        return submissionService.getAllSubmissions();
    }

    @GetMapping("/{assignmentId}")
    public AdminSubmissionDetailResponse getSubmissionDetails(@PathVariable String assignmentId) {
        return submissionService.getSubmissionDetails(assignmentId);
    }

    @PostMapping("/{assignmentId}/refresh")
    public AdminSubmissionDetailResponse refresh(@PathVariable String assignmentId) {
        aiService.refreshEvaluation(assignmentId);
        return submissionService.getSubmissionDetails(assignmentId);
    }
}
