package com.testia.infraestructure.adapter.in.web;

import com.testia.application.dto.AiEvaluationResponse;
import com.testia.application.service.AiEvaluationService;
import com.testia.domain.model.EvaluationResult;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/admin/evaluation")
public class EvaluationController {

    private final AiEvaluationService evaluationService;


    public EvaluationController(AiEvaluationService evaluationService) {
        this.evaluationService = evaluationService;
    }

    @PostMapping("/{assignmentId}")
    public ResponseEntity<AiEvaluationResponse> evaluate(
            @PathVariable String assignmentId
    ) {

        EvaluationResult result = evaluationService.evaluateAssignment(assignmentId);

        AiEvaluationResponse response = AiEvaluationResponse.builder()
                .overallScore(result.getOverallScore())
                .bucketScores(
                        result.getBucketScores()
                                .stream()
                                .map(b -> AiEvaluationResponse.BucketDto.builder()
                                        .bucketName(b.getBucketName())
                                        .score(b.getScore())
                                        .build()
                                ).collect(Collectors.toList())
                )
                .bigOTime(result.getBigOTime())
                .bigOSpace(result.getBigOSpace())
                .lineCount(result.getLineCount())
                .edgeCaseCoverage(result.getEdgeCaseCoverage())
                .securityNotes(result.getSecurityNotes())
                .globalSummary(result.getGlobalSummary())
                .build();

        return ResponseEntity.ok(response);
    }

    @PostMapping("/{assignmentId}/refresh")
    public ResponseEntity<EvaluationResult> refresh(@PathVariable String assignmentId) {
        return ResponseEntity.ok(evaluationService.refreshEvaluation(assignmentId));
    }


}
