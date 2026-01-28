package com.etms.service.impl;

import com.etms.config.JwtUtil;
import com.etms.dto.LoginRequest;
import com.etms.dto.LoginResponse;
import com.etms.entity.Employee;
import com.etms.entity.PasswordResetToken;
import com.etms.enums.Status;
import com.etms.repository.EmployeeRepository;
import com.etms.repository.PasswordResetTokenRepository;
import com.etms.service.AuditService;
import com.etms.service.AuthService;
import com.etms.service.EmployeeService;

import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

  private final EmployeeRepository repo;
  private final JwtUtil jwtUtil;
  private final BCryptPasswordEncoder encoder;
  private final PasswordResetTokenRepository tokenRepo;
  private final EmployeeRepository empRepo;
  private final EmployeeService empService;
  private final AuditService auditService;

  @Override
  public LoginResponse login(LoginRequest request) {

    Employee emp = repo.findByEmail(request.getEmail())
        .orElseThrow(() -> new RuntimeException("Invalid credentials"));

    // 🔒 BLOCK DEACTIVATED USERS
    if (emp.getStatus() != Status.ACTIVE) {
      throw new RuntimeException("Account is deactivated");
    }

    if (!encoder.matches(request.getPassword(), emp.getPassword())) {
      throw new RuntimeException("Invalid credentials");
    }

    String token = jwtUtil.generateToken(
        emp.getEmail(),
        emp.getRole().getRoleName()
    );

    auditService.log(
        emp.getEmail(),
        "LOGIN_SUCCESS",
        "EMPLOYEE",
        emp.getEmpId()
    );

    return new LoginResponse(
        token,
        emp.getRole().getRoleName(),
        emp.getName(),
        emp.getEmail()
    );
  }

  @Override
  public String forgotPassword(String email) {

    empRepo.findByEmail(email)
        .orElseThrow(() -> new RuntimeException("Email not registered"));

    PasswordResetToken token = new PasswordResetToken();
    token.setEmail(email);
    token.setToken(UUID.randomUUID().toString());
    token.setExpiry(LocalDateTime.now().plusMinutes(30));

    tokenRepo.save(token);

    // DEV MODE
    System.out.println("RESET TOKEN: " + token.getToken());

    return token.getToken();
  }

  @Override
  public void resetPassword(String token, String newPassword) {

    PasswordResetToken resetToken = tokenRepo.findByToken(token)
        .orElseThrow(() -> new RuntimeException("Invalid token"));

    if (resetToken.getExpiry().isBefore(LocalDateTime.now())) {
      throw new RuntimeException("Token expired");
    }

    empService.resetPassword(resetToken.getEmail(), newPassword);
    tokenRepo.delete(resetToken);

    auditService.log(
        resetToken.getEmail(),
        "PASSWORD_RESET",
        "EMPLOYEE",
        null
    );
  }
}
