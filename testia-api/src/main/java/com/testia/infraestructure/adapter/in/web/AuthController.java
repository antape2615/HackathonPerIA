package com.testia.infraestructure.adapter.in.web;

import com.testia.application.dto.SetPasswordRequest;
import com.testia.application.service.*;
import com.testia.domain.model.User;
import com.testia.infraestructure.adapter.in.web.dto.LoginRequest;
import com.testia.infraestructure.adapter.in.web.dto.LoginResponse;
import com.testia.infraestructure.adapter.in.web.dto.RegisterRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final RegisterUserService registerService;
    private final LoginUserService loginService;
    private final GetCurrentUserService getCurrentUserService;
    private final UserService userService;
    private final CheckEmailService service;

    public AuthController(RegisterUserService registerService, LoginUserService loginService, GetCurrentUserService getCurrentUserService, UserService userService, CheckEmailService service) {
        this.registerService = registerService;
        this.loginService = loginService;
        this.getCurrentUserService = getCurrentUserService;
        this.userService = userService;
        this.service = service;
    }

    @PostMapping("/register")
    public String register(@Valid @RequestBody RegisterRequest request) {
        registerService.register(request.getEmail(), request.getPassword());
        return "Registered successfully";
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        LoginResponse response = loginService.login(request.getEmail(), request.getPassword());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<User> me(@RequestHeader("Authorization") String authHeader) {

        String token = authHeader.replace("Bearer ", "");

        User user = getCurrentUserService.getCurrentUser();

        return ResponseEntity.ok(user);
    }

    @PostMapping("/set-password")
    public ResponseEntity<String> setPassword(@RequestBody SetPasswordRequest req) {
        userService.setPasswordForInvitedUser(req.email(), req.password());

        return ResponseEntity.ok("Password set successfully. You can now log in.");
    }

    @GetMapping("/check-email")
    public ResponseEntity<Map<String, Boolean>> checkEmail(@RequestParam String email) {
        boolean exists = service.emailExists(email);
        return ResponseEntity.ok(Map.of("exists", exists));
    }

}