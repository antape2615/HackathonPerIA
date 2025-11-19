package com.testia.infraestructure.adapter.out.db.entity;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TestCaseEntity {
    private String input;
    private String expectedOutput;
    private String type;
}
