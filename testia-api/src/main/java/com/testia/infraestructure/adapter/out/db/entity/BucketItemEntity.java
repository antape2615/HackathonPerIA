package com.testia.infraestructure.adapter.out.db.entity;

import lombok.Data;
import java.time.Instant;
import java.util.List;

@Data
public class BucketItemEntity {
    private String generatedTestId;
    private List<String> tags;
    private Instant createdAt;
}
