package com.testia.infraestructure.adapter.in.web;

import com.testia.application.dto.UpdateUserRoleRequest;
import com.testia.application.service.AdminUserService;
import com.testia.domain.model.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/users")
public class AdminUserController {

    private final AdminUserService adminUserService;

    public AdminUserController(AdminUserService adminUserService) {
        this.adminUserService = adminUserService;
    }

    @PatchMapping("/{userId}/role")
    public ResponseEntity<User> updateRole(
            @PathVariable UUID userId,
            @RequestBody UpdateUserRoleRequest request
    ) {
        User updated = adminUserService.updateUserRole(userId, request.role());
        return ResponseEntity.ok(updated);
    }
}
