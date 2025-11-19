package com.testia.infraestructure.adapter.out.db.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;
import java.util.Map;

@Data
@Document(collection = "test_buckets")
public class TestBucketEntity {

    @Id
    private String id; // bucket:java:senior:2025-11-12-01

    private String language;
    private String level;
    private String bucketId;
    private int size;

    private List<BucketItemEntity> items;

    private Map<String, Integer> tagsCount;
    private Double avgIaScore;
    private Double passRate;
}