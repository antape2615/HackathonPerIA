package com.testia.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Document(collection = "generated_tests")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GeneratedTestEntity {

    @Id
    private String id;

    private String language;
    private String level;

    private String problemStatement;
    private String starterCode;

    private List<TestCase> testCases;
    private List<String> difficultyTags;

    private Instant generatedAt;

    private String createdBy;       // admin/interviewer
}

