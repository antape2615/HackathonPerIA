package com.testia.application.service;

import com.testia.application.dto.CandidateTestListItem;
import com.testia.application.service.GetCurrentUserService;
import com.testia.domain.model.AssignedTest;
import com.testia.domain.model.GeneratedTest;
import com.testia.domain.port.AssignedTestRepositoryPort;
import com.testia.domain.port.GeneratedTestRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CandidateAggregationService {

    private final AssignedTestRepositoryPort assignmentRepo;
    private final GeneratedTestRepositoryPort testRepo;
    private final GetCurrentUserService currentUserService;

    public List<CandidateTestListItem> getCandidateTests() {

        String email = currentUserService.getCurrentUserEmail();

        List<AssignedTest> assignments = assignmentRepo.findByCandidateEmail(email);

        // Preload test details without N+1
        Set<UUID> testIds = assignments.stream()
                .map(AssignedTest::getTestId)
                .collect(Collectors.toSet());

        Map<UUID, GeneratedTest> tests = testRepo.findAllByIdMap(testIds);

        return assignments.stream().map(a -> {
            GeneratedTest test = tests.get(a.getTestId());

            return new CandidateTestListItem(
                    a.getId().toString(),
                    test.getLanguage(),
                    test.getLevel(),
                    test.getLevel().toUpperCase() + " / " + test.getLanguage().toUpperCase(),
                    a.getStatus().name().equals("COMPLETED") ? "completed" : "pending",
                    a.getAssignedAt().toString(),
                    60,
                    test.getProblemStatement(),
                    test.getTestCases().size()
            );
        }).toList();
    }
}
