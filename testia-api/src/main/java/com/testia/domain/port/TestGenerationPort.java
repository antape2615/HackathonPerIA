package com.testia.domain.port;

import com.testia.domain.model.GeneratedTest;

public interface TestGenerationPort {
    GeneratedTest generateTest(String language, String seniorityLevel);
}