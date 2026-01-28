package com.etms.config;

import com.etms.entity.Employee;
import com.etms.enums.Status;
import com.etms.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final EmployeeRepository repo;

    @Override
    public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {

        Employee emp = repo.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // 🔒 BLOCK INACTIVE USERS AT AUTH LAYER
        if (emp.getStatus() != Status.ACTIVE) {
            throw new UsernameNotFoundException("Account is deactivated");
        }

        String roleName = emp.getRole().getRoleName().toUpperCase();

        return User.withUsername(emp.getEmail())
                .password(emp.getPassword())
                .roles(roleName)   // AUTO adds ROLE_
                .build();
    }
}
