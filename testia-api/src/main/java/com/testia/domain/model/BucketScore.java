package com.testia.domain.model;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BucketScore {
    private String bucketName;
    private double score;
}
