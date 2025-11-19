package com.testia.infraestructure.adapter.out.db.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "generated_tests")
public class GeneratedTestEntity {

    @Id
    private UUID id;

    private String language;
    private String level;
    private String problemStatement;
    private String starterCode;
    private List<TestCaseEntity> testCases;
    private List<String> difficultyTags;
    private Instant generatedAt;
}