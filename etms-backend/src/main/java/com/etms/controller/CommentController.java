package com.etms.controller;

import com.etms.dto.CommentRequest;
import com.etms.entity.TaskComment;
import com.etms.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService service;

    //  BOTH ADMIN + EMPLOYEE CAN ADD COMMENTS
    @PostMapping("/{taskId}/comments")
    @PreAuthorize("hasAnyRole('ADMIN','EMPLOYEE')")
    public TaskComment add(
            @PathVariable Long taskId,
            @RequestBody CommentRequest req,
            Authentication auth) {

        return service.addComment(taskId, auth.getName(), req.getComment());
    }

    //  ADMIN ONLY — VIEW ALL COMMENTS
    @GetMapping("/{taskId}/comments")
    @PreAuthorize("hasRole('ADMIN')")
    public List<TaskComment> adminView(@PathVariable Long taskId) {
        return service.getCommentsForTask(taskId, null, true);
    }

    //  EMPLOYEE ONLY — VIEW OWN TASK COMMENTS
    @GetMapping("/my/{taskId}/comments")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public List<TaskComment> employeeView(@PathVariable Long taskId, Authentication auth) {
        return service.getCommentsForTask(taskId, auth.getName(), false);
    }
}
