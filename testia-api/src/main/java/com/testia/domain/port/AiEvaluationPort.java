package com.testia.domain.port;

import com.testia.domain.model.CandidateSubmission;
import com.testia.domain.model.GeneratedTest;
import com.testia.domain.model.EvaluationResult;

public interface AiEvaluationPort {

    EvaluationResult evaluate(
            CandidateSubmission submission,
            GeneratedTest test
    );
}
