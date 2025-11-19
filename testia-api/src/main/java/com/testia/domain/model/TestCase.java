package com.testia.domain.model;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TestCase {
    private String input;
    private String expectedOutput;
    private String type; //arrays, strings, matrices...
}
