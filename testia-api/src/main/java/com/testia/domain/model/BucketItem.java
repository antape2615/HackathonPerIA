package com.testia.domain.model;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.List;

@Data
@Builder
public class BucketItem {
    private String generatedTestId;
    private List<String> tags;
    private Instant createdAt;
}
