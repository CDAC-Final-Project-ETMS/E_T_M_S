package com.etms.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.etms.dto.TaskRequest;
import com.etms.entity.Task;
import com.etms.entity.TaskHistory;
import com.etms.enums.TaskStatus;
import com.etms.service.TaskService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

  private final TaskService service;

  @PostMapping
  @PreAuthorize("hasRole('ADMIN')")
  public Task create(@RequestBody TaskRequest request) {
    return service.createFromRequest(request);
  }

  @GetMapping("/employee/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public List<Task> getByEmployee(@PathVariable Long id) {
    return service.getByEmployee(id);
  }

  @GetMapping
  @PreAuthorize("hasRole('ADMIN')")
  public List<Task> getAll() {
    return service.getAll();
  }

  // 🔒 EMPLOYEE ONLY
  @PutMapping("/{taskId}/status")
  @PreAuthorize("hasRole('EMPLOYEE')")
  public Task updateStatus(
      @PathVariable Long taskId,
      @RequestParam TaskStatus status) {
    return service.updateStatus(taskId, status);
  }

  @GetMapping("/my")
  @PreAuthorize("hasRole('EMPLOYEE')")
  public List<Task> myTasks(Authentication auth) {
    return service.getForLoggedInUser(auth.getName());
  }

  @PostMapping("/{id}/complete")
  @PreAuthorize("hasRole('EMPLOYEE')")
  public void completeTask(@PathVariable Long id, Authentication auth) {
    service.completeTask(id, auth.getName());
  }

  @DeleteMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public void deleteTask(@PathVariable Long id) {
    service.deleteTask(id);
  }

  @GetMapping("/history/my")
  @PreAuthorize("hasRole('EMPLOYEE')")
  public List<TaskHistory> myHistory(Authentication auth) {
    return service.getMyHistory(auth.getName());
  }

  @GetMapping("/history")
  @PreAuthorize("hasRole('ADMIN')")
  public List<TaskHistory> allHistory() {
    return service.getAllHistory();
  }
}
