package com.testia.application.service;

import com.testia.domain.model.GeneratedTest;
import com.testia.domain.port.TestGenerationPort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class BatchTestGenerationService {

    private final TestGenerationPort aiPort;

    public BatchTestGenerationService(TestGenerationPort aiPort) {
        this.aiPort = aiPort;
    }

    public List<GeneratedTest> generateBatch(String language, String seniority) {
        List<GeneratedTest> result = new ArrayList<>();

        for (int i = 0; i < 3; i++) {
            result.add(aiPort.generateTest(language, seniority));
        }

        return result;
    }
}
