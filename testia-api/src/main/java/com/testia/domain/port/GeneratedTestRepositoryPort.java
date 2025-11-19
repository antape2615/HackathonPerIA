package com.testia.domain.port;

import com.testia.domain.model.GeneratedTest;

import java.util.*;

public interface GeneratedTestRepositoryPort {

    GeneratedTest save(GeneratedTest test);
    Optional<GeneratedTest> findById(UUID id);

    // BULK LOAD ↓↓↓
    List<GeneratedTest> findAllById(Set<UUID> ids);

    default Map<UUID, GeneratedTest> findAllByIdMap(Set<UUID> ids) {
        Map<UUID, GeneratedTest> map = new HashMap<>();
        for (GeneratedTest t : findAllById(ids)) {
            map.put(t.getId(), t);
        }
        return map;
    }
}
