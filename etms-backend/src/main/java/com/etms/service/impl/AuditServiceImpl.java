package com.etms.service.impl;

import com.etms.entity.AuditLog;
import com.etms.repository.AuditLogRepository;
import com.etms.service.AuditService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuditServiceImpl implements AuditService {

    private final AuditLogRepository repo;

    @Override
    public void log(String email, String action, String entity, Long id) {

        AuditLog log = new AuditLog();
        log.setUserEmail(email);
        log.setAction(action);
        log.setEntityType(entity);
        log.setEntityId(id);
        log.setTimestamp(LocalDateTime.now());

        repo.save(log);
    }

    @Override
    public List<AuditLog> getAll() {
        return repo.findAll();
    }

    @Override
    public List<AuditLog> getByUser(String email) {
        return repo.findByUserEmail(email);
    }
}
