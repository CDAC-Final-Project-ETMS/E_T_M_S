package com.etms.service;

import com.etms.entity.AuditLog;
import java.util.List;

public interface AuditService {

    void log(String userEmail, String action, String entityType, Long entityId);

    List<AuditLog> getAll();

    List<AuditLog> getByUser(String email);
}
