package com.testia.domain.port;

import com.testia.domain.model.BucketItem;
import com.testia.domain.model.TestBucket;

import java.util.Optional;

public interface TestBucketRepositoryPort {
    TestBucket getOrCreate(String language, String level);
    void appendItem(String bucketId, BucketItem item);
    Optional<BucketItem> pickOne(String language, String level);
}