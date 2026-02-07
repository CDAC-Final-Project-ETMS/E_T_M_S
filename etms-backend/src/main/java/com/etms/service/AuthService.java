package com.etms.service;

import com.etms.dto.LoginRequest;
import com.etms.dto.LoginResponse;

public interface AuthService {
  LoginResponse login(LoginRequest request);

  String forgotPassword(String email);

  void resetPassword(String token, String newPassword);
}
