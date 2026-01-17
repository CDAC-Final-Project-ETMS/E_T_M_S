package com.etms.dto;

import lombok.Data;

@Data
public class ChangePasswordRequest {
  private String oldPassword;
  private String newPassword;
}
