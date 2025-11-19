package com.testia.domain.model;

import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@Builder(toBuilder = true)
public class TestBucket {
    private String id;               // bucket:java:senior:2025-11-11-01
    private String language;
    private String level;
    private String bucketId;         // timestamp or counter
    private int size;
    private List<BucketItem> items;

    // métricas agregadas
    private Map<String, Integer> tagsCount; // {"graphs": 21, "dp": 7}
    private Double avgIaScore;             // opcional
    private Double passRate;               // opcional
}
