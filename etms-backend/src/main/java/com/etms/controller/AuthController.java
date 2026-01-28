package com.etms.controller;

import com.etms.entity.Employee;
import com.etms.service.AuthService;
import com.etms.service.EmployeeService;
import com.etms.dto.ChangePasswordRequest;
import com.etms.dto.ForgotPasswordRequest;
import com.etms.dto.LoginRequest;
import com.etms.dto.LoginResponse;
import com.etms.dto.ResetPasswordRequest;

import jakarta.annotation.security.PermitAll;
import lombok.RequiredArgsConstructor;

import java.util.Map;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin
public class AuthController {

    private final AuthService authService;
    private final EmployeeService employeeService;   // ✅ ADD THIS

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/bootstrap-admin")
    @PermitAll
    public Employee bootstrapAdmin(@RequestBody Employee emp) {
        return employeeService.createAdmin(emp);   // ✅ NOW RESOLVES
    }
    
    @PostMapping("/change-password")
    @PreAuthorize("hasAnyRole('ADMIN','EMPLOYEE')")
    public void changePassword(
        @RequestBody ChangePasswordRequest req,
        Authentication auth) {

    	employeeService.changePassword(
          auth.getName(),
          req.getOldPassword(),
          req.getNewPassword());
    }
    
    @PostMapping("/forgot-password")
    public Map<String, Object> forgotPassword(@RequestBody ForgotPasswordRequest req) {
        String token = authService.forgotPassword(req.getEmail());

        return Map.of(
            "message", "Reset token generated",
            "token", token   // 👈 SEND TOKEN TO FRONTEND
        );
    }

    
    @PostMapping("/reset-password")
    public void resetPassword(@RequestBody ResetPasswordRequest req) {
      authService.resetPassword(req.getToken(), req.getNewPassword());
    }
    
    @GetMapping("/debug-me")
    public Object debug(Authentication auth) {
        return auth;
    }




}
