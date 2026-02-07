package com.etms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponse {

    private String token;
    private String role;

    private String name;
    private String email;

    public LoginResponse(String token, String role) {
        this.token = token;
        this.role = role;
    }
}
