package com.testia.application.service;

import com.testia.domain.exception.DomainException;
import com.testia.domain.model.*;
import com.testia.domain.port.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class AiEvaluationService {

    private final AiEvaluationPort aiPort;
    private final AssignedTestRepositoryPort assignmentRepo;
    private final CandidateSubmissionRepositoryPort submissionRepo;
    private final GeneratedTestRepositoryPort testRepo;
    private final EvaluationResultRepositoryPort evalRepo; // <-- NEW

    public AiEvaluationService(
            AiEvaluationPort aiPort,
            AssignedTestRepositoryPort assignmentRepo,
            CandidateSubmissionRepositoryPort submissionRepo,
            GeneratedTestRepositoryPort testRepo,
            EvaluationResultRepositoryPort evalRepo   // <-- NEW
    ) {
        this.aiPort = aiPort;
        this.assignmentRepo = assignmentRepo;
        this.submissionRepo = submissionRepo;
        this.testRepo = testRepo;
        this.evalRepo = evalRepo;  // <-- NEW
    }

    // -------------------------------------------------------------------
    //  METODO FINAL evaluateAssignment()
    //  - Busca si ya existe evaluación
    //  - Si existe → la devuelve
    //  - Si no → evalúa con IA y la guarda
    // -------------------------------------------------------------------
    public EvaluationResult evaluateAssignment(String assignmentId) {

        UUID id;
        try {
            id = UUID.fromString(assignmentId);
        } catch (Exception e) {
            throw new DomainException("Invalid assignment ID", HttpStatus.BAD_REQUEST);
        }

        // 1. Buscar evaluación previa
        Optional<EvaluationResult> existing = evalRepo.findByAssignmentId(id);
        if (existing.isPresent()) {
            return existing.get();  // YA EXISTE → NO llamar IA
        }

        // 2. Obtener AssignedTest
        System.out.println(id);
        AssignedTest assignment = assignmentRepo.findById(id)
                .orElseThrow(() -> new DomainException("Assignment not found", HttpStatus.NOT_FOUND));

        // 3. Obtener submission del candidato
        CandidateSubmission submission = submissionRepo.findByAssignmentId(id)
                .orElseThrow(() -> new DomainException("Submission not found for this assignment", HttpStatus.NOT_FOUND));

        // 4. Obtener test original
        GeneratedTest test = testRepo.findById(assignment.getTestId())
                .orElseThrow(() -> new DomainException("Generated test not found", HttpStatus.NOT_FOUND));

        // 5. Evaluar con IA (Groq)
        EvaluationResult result = aiPort.evaluate(submission, test);

        // 6. Guardar evaluación en Mongo
        evalRepo.save(id, result);

        // 7. Retornar evaluación nueva
        return result;
    }

    // -------------------------------------------------------------------
    //  METODO PARA BOTÓN “RE-EVALUAR”
    // -------------------------------------------------------------------
    public EvaluationResult refreshEvaluation(String assignmentId) {

        UUID id = UUID.fromString(assignmentId);

        // 1. Borrar evaluación previa
        evalRepo.deleteById(UUID.fromString(assignmentId));

        // 2. Hacer evaluación desde cero
        return evaluateAssignment(assignmentId);
    }
}
