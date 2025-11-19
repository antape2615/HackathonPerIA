package com.testia.application.service;

import com.testia.domain.exception.DomainException;
import com.testia.domain.model.AssignedTest;
import com.testia.domain.model.AssignedTestStatus;
import com.testia.domain.model.GeneratedTest;
import com.testia.domain.model.User;
import com.testia.domain.port.AssignedTestRepositoryPort;
import com.testia.domain.port.GeneratedTestRepositoryPort;
import com.testia.infraestructure.adapter.out.email.BrevoEmailService;
import com.testia.infraestructure.adapter.out.email.EmailTemplates;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class TestAssignmentService {

    private final BrevoEmailService emailService;
    private final GeneratedTestRepositoryPort generatedTestRepo;
    private final AssignedTestRepositoryPort assignmentRepo;
    private final GetCurrentUserService currentUserService;
    private final InvitedUserService invitedUserService;

    public TestAssignmentService(
            BrevoEmailService emailService,
            GeneratedTestRepositoryPort generatedTestRepo,
            AssignedTestRepositoryPort assignmentRepo,
            GetCurrentUserService currentUserService,
            InvitedUserService invitedUserService
    ) {
        this.emailService = emailService;
        this.generatedTestRepo = generatedTestRepo;
        this.assignmentRepo = assignmentRepo;
        this.currentUserService = currentUserService;
        this.invitedUserService = invitedUserService;
    }

    public AssignedTest assignEphemeralTest(GeneratedTest test, String candidateEmail) {

        // ---------------------------
        // 1️⃣ Validaciones iniciales
        // ---------------------------
        if (candidateEmail == null || candidateEmail.isBlank()) {
            throw new DomainException("Candidate email is required", HttpStatus.BAD_REQUEST);
        }

        if (test == null) {
            throw new DomainException("Test payload is required", HttpStatus.BAD_REQUEST);
        }

        // ---------------------------
        // 2️⃣ Crear usuario invitado si no existe
        // ---------------------------
        User candidate = invitedUserService.getOrCreateInvitedCandidate(candidateEmail);

        // ---------------------------
        // 3️⃣ Asegurar ID del test
        // ---------------------------
        if (test.getId() == null) {
            test.setId(UUID.randomUUID());
        }

        // Guardar o sobrescribir el test efímero
        GeneratedTest savedTest = generatedTestRepo.save(test);

        // ---------------------------
        // 4️⃣ Obtener recruiter del JWT
        // ---------------------------
        String recruiterEmail = currentUserService.getCurrentUserEmail();

        // ---------------------------
        // 5️⃣ Validar que NO exista ya esta asignación
        // ---------------------------
        boolean alreadyAssigned = assignmentRepo.existsByCandidateEmailAndTestId(
                candidate.getEmail(),
                savedTest.getId()
        );

        if (alreadyAssigned) {
            throw new DomainException(
                    "This test is already assigned to this candidate",
                    HttpStatus.CONFLICT
            );
        }

        // ---------------------------
        // 6️⃣ Crear AssignedTest
        // ---------------------------
        AssignedTest assignment = AssignedTest.builder()
                .id(UUID.randomUUID())
                .testId(savedTest.getId())
                .candidateEmail(candidate.getEmail())
                .assignedAt(Instant.now())
                .assignedBy(recruiterEmail)
                .status(AssignedTestStatus.SENT)
                .build();

        AssignedTest savedAssignment = assignmentRepo.save(assignment);

        // ---------------------------
        // 7️⃣ Enviar email al candidato
        // ---------------------------
        sendEmailForAssignment(candidate.getEmail(), savedTest, savedAssignment);

        return savedAssignment;
    }


    private void sendEmailForAssignment(String candidateEmail, GeneratedTest test, AssignedTest assignment) {
        String link = "http://localhost:5173//take-test/" + assignment.getId();

        String html = EmailTemplates.buildTestInvitationEmail(test, link);

        emailService.sendEmail(
                candidateEmail,
                "Invitación a prueba técnica - TestIA",
                html
        );
    }

    // ==========================================================
    //                LISTAR ASIGNACIONES POR ROL
    // ==========================================================

    public List<AssignedTest> getAssignmentsForCurrentUser() {

        String email = currentUserService.getCurrentUserEmail();
        String role = currentUserService.getCurrentUserRole();

        // Si no está logueado
        if (email == null || role == null) {
            return List.of();
        }

        switch (role) {

            case "ROLE_ADMIN":
                return assignmentRepo.findAll();

            case "ROLE_RECRUITER":
                return assignmentRepo.findByAssignedBy(email);

            case "ROLE_CANDIDATE":
                // Si el candidato NO tiene asignaciones → return empty list
                List<AssignedTest> tests = assignmentRepo.findByCandidateEmail(email);
                return tests != null ? tests : List.of();

            default:
                return List.of();
        }
    }


    // Endpoint global opcional
    public List<AssignedTest> getAllAssignments() {
        return assignmentRepo.findAll();
    }
}
