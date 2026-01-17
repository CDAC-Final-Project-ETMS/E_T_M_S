package com.etms.controller;

import com.etms.entity.AuditLog;
import com.etms.service.AuditService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/audit-logs")
@RequiredArgsConstructor
public class AuditController {

    private final AuditService service;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<AuditLog> all() {
        return service.getAll();
    }

    @GetMapping("/user")
    @PreAuthorize("hasRole('ADMIN')")
    public List<AuditLog> byUser(@RequestParam String email) {
        return service.getByUser(email);
    }
}
