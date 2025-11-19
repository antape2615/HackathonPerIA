package com.testia.infraestructure.adapter.out.db.entity;

import com.testia.domain.model.BucketScore;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Data
@Document(collection = "evaluation_results")
public class EvaluationResultEntity {

    @Id
    private String id;

    private UUID assignmentId;

    private double overallScore;
    private List<BucketScore> bucketScores;

    private String bigOTime;
    private String bigOSpace;
    private int lineCount;

    private List<String> edgeCaseCoverage;
    private List<String> securityNotes;

    private String globalSummary;

    private Instant evaluatedAt;
}
