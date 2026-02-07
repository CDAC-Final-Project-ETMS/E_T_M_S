package com.etms.service.impl;

import com.etms.entity.*;
import com.etms.repository.*;
import com.etms.service.CommentService;
import com.etms.service.AuditService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

    private final TaskRepository taskRepo;
    private final EmployeeRepository empRepo;
    private final TaskCommentRepository commentRepo;
    private final AuditService auditService;

    @Override
    public TaskComment addComment(Long taskId, String email, String text) {

        Employee emp = empRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        Task task = taskRepo.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        //Employee can comment only on own task
        if ("EMPLOYEE".equalsIgnoreCase(emp.getRole().getRoleName()) &&
            !task.getAssignedTo().getEmpId().equals(emp.getEmpId())) {
            throw new RuntimeException("Not allowed to comment on this task");
        }

        //Admin can comment on any task

        TaskComment c = new TaskComment();
        c.setTask(task);
        c.setEmployee(emp);
        c.setComment(text);
        c.setCreatedAt(LocalDateTime.now());

        TaskComment saved = commentRepo.save(c);

        auditService.log(email, "COMMENT_ADDED", "TASK", taskId);

        return saved;
    }

    @Override
    public List<TaskComment> getCommentsForTask(Long taskId, String email, boolean isAdmin) {

        Task task = taskRepo.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (isAdmin) {
            return commentRepo.findByTask_TaskId(taskId);
        }

        
        Employee emp = empRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        // employee only view comments for own task
        if (!task.getAssignedTo().getEmpId().equals(emp.getEmpId())) {
            throw new RuntimeException("Access denied");
        }

        return commentRepo.findByTask_TaskId(taskId);
    }
}
