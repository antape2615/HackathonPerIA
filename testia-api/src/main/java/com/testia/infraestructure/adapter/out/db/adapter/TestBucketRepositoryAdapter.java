package com.testia.infraestructure.adapter.out.db.adapter;

import com.testia.domain.model.BucketItem;
import com.testia.domain.model.TestBucket;
import com.testia.domain.port.TestBucketRepositoryPort;
import com.testia.infraestructure.adapter.out.db.entity.BucketItemEntity;
import com.testia.infraestructure.adapter.out.db.entity.TestBucketEntity;
import com.testia.infraestructure.adapter.out.db.repository.SpringDataTestBucketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class TestBucketRepositoryAdapter implements TestBucketRepositoryPort {

    private static final int MAX_ITEMS_PER_BUCKET = 300;

    private final SpringDataTestBucketRepository repo;

    @Override
    public TestBucket getOrCreate(String language, String level) {

        List<TestBucketEntity> buckets = repo.findByLanguageAndLevelOrderByBucketIdDesc(language, level);

        // Si existe bucket → usar el más reciente
        if (!buckets.isEmpty()) {
            return toDomain(buckets.get(0));
        }

        // Si no existe → crear bucket #1
        TestBucketEntity newBucket = new TestBucketEntity();
        newBucket.setLanguage(language);
        newBucket.setLevel(level);
        newBucket.setBucketId("1");
        newBucket.setId(buildBucketKey(language, level, "1"));
        newBucket.setItems(new ArrayList<>());
        newBucket.setTagsCount(new HashMap<>());
        newBucket.setSize(0);
        repo.save(newBucket);

        return toDomain(newBucket);
    }

    @Override
    public void appendItem(String bucketId, BucketItem item) {
        TestBucketEntity bucket = repo.findById(bucketId)
                .orElseThrow(() -> new RuntimeException("Bucket not found: " + bucketId));

        // Si bucket está lleno → crear uno nuevo
        if (bucket.getSize() >= MAX_ITEMS_PER_BUCKET) {
            bucket = createNextBucket(bucket);
        }

        // Convert item → entity
        BucketItemEntity entityItem = new BucketItemEntity();
        entityItem.setGeneratedTestId(item.getGeneratedTestId());
        entityItem.setTags(item.getTags());
        entityItem.setCreatedAt(Instant.now());

        bucket.getItems().add(entityItem);
        bucket.setSize(bucket.getSize() + 1);

        // Actualizar métricas de tags
        if (bucket.getTagsCount() == null) bucket.setTagsCount(new HashMap<>());
        for (String tag : item.getTags()) {
            bucket.getTagsCount().merge(tag, 1, Integer::sum);
        }

        repo.save(bucket);
    }

    @Override
    public Optional<BucketItem> pickOne(String language, String level) {

        List<TestBucketEntity> buckets = repo.findByLanguageAndLevelOrderByBucketIdDesc(language, level);

        if (buckets.isEmpty()) return Optional.empty();

        TestBucketEntity latest = buckets.get(0);

        if (latest.getItems() == null || latest.getItems().isEmpty()) return Optional.empty();

        BucketItemEntity randomItem = latest.getItems()
                .get(new Random().nextInt(latest.getItems().size()));

        return Optional.of(BucketItem.builder()
                .generatedTestId(randomItem.getGeneratedTestId())
                .tags(randomItem.getTags())
                .createdAt(randomItem.getCreatedAt())
                .build());
    }

    // Helpers
    private TestBucketEntity createNextBucket(TestBucketEntity current) {
        int nextNumber = Integer.parseInt(current.getBucketId()) + 1;
        String nextBucketId = String.valueOf(nextNumber);

        TestBucketEntity newBucket = new TestBucketEntity();
        newBucket.setLanguage(current.getLanguage());
        newBucket.setLevel(current.getLevel());
        newBucket.setBucketId(nextBucketId);
        newBucket.setId(buildBucketKey(current.getLanguage(), current.getLevel(), nextBucketId));
        newBucket.setItems(new ArrayList<>());
        newBucket.setTagsCount(new HashMap<>());
        newBucket.setSize(0);

        repo.save(newBucket);
        return newBucket;
    }

    private String buildBucketKey(String language, String level, String bucketId) {
        return "bucket:" + language + ":" + level + ":" + bucketId;
    }

    private TestBucket toDomain(TestBucketEntity e) {
        return TestBucket.builder()
                .id(e.getId())
                .language(e.getLanguage())
                .level(e.getLevel())
                .bucketId(e.getBucketId())
                .size(e.getSize())
                .items(e.getItems().stream().map(i ->
                        BucketItem.builder()
                                .generatedTestId(i.getGeneratedTestId())
                                .tags(i.getTags())
                                .createdAt(i.getCreatedAt())
                                .build()
                ).collect(Collectors.toList()))
                .tagsCount(e.getTagsCount())
                .avgIaScore(e.getAvgIaScore())
                .passRate(e.getPassRate())
                .build();
    }
}
