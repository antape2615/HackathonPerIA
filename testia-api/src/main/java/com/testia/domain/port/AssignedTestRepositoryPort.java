package com.testia.domain.port;

import com.testia.domain.model.AssignedTest;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AssignedTestRepositoryPort {

    AssignedTest save(AssignedTest test);

    Optional<AssignedTest> findById(UUID id);

    List<AssignedTest> findByCandidateEmail(String email);

    List<AssignedTest> findByAssignedBy(String email);

    List<AssignedTest> findAll();

    boolean existsByCandidateEmailAndTestId(String email, UUID testId);

    void update(AssignedTest assignment);

    // NUEVO: paginación
    List<AssignedTest> findPaged(int page, int size);

    List<AssignedTest> findByAssignedByPaged(String email, int page, int size);
}

