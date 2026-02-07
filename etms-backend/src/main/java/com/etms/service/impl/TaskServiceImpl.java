package com.etms.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.etms.dto.TaskRequest;
import com.etms.entity.Employee;
import com.etms.entity.Task;
import com.etms.entity.TaskHistory;
import com.etms.enums.Priority;
import com.etms.enums.Status;
import com.etms.enums.TaskStatus;
import com.etms.repository.EmployeeRepository;
import com.etms.repository.TaskHistoryRepository;
import com.etms.repository.TaskRepository;
import com.etms.repository.TaskCommentRepository;   
import com.etms.service.AuditService;
import com.etms.service.TaskService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {

  private final TaskRepository repo;
  private final EmployeeRepository empRepo;
  private final TaskHistoryRepository historyRepo;
  private final TaskCommentRepository commentRepo;  
  private final AuditService auditService;

  @Override
  public Task createFromRequest(TaskRequest request) {

    if (request.getEmpId() == null) {
      throw new RuntimeException("Employee ID is required");
    }

    //block past due dates
    if (request.getDueDate() != null &&
        request.getDueDate().isBefore(java.time.LocalDate.now())) {
      throw new RuntimeException("Due date cannot be in the past");
    }

    Employee emp = empRepo.findById(request.getEmpId())
        .orElseThrow(() -> new RuntimeException("Employee not found"));

    //block admin assignment
    if ("ADMIN".equalsIgnoreCase(emp.getRole().getRoleName())) {
      throw new RuntimeException("Task cannot be assigned to admin");
    }

    if (emp.getStatus() != Status.ACTIVE) {
      throw new RuntimeException("Cannot assign task to inactive employee");
    }

    Task task = new Task();
    task.setTitle(request.getTitle());
    task.setDescription(request.getDescription());
    task.setStatus(TaskStatus.TODO);
    task.setDueDate(request.getDueDate());
    task.setPriority(
        request.getPriority() != null ? request.getPriority() : Priority.MEDIUM
    );

    task.setAssignedTo(emp);

    Task saved = repo.save(task);
    auditService.log("SYSTEM", "TASK_CREATED", "TASK", saved.getTaskId());
    return saved;
  }

  @Override
  public List<Task> getByEmployee(Long empId) {

    var auth = SecurityContextHolder.getContext().getAuthentication();
    boolean isAdmin = auth.getAuthorities().stream()
        .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

    if (!isAdmin) {
      throw new RuntimeException("Access denied");
    }

    return repo.findByAssignedTo_EmpId(empId);
  }

  @Override
  public List<Task> getAll() {
    return repo.findAll();
  }

  @Override
  public Task updateStatus(Long taskId, TaskStatus status) {

    Task task = repo.findById(taskId)
        .orElseThrow(() -> new RuntimeException("Task not found"));

    task.setStatus(status);

    Task saved = repo.save(task);

    if (status == TaskStatus.DONE) {
      auditService.log(
          task.getAssignedTo().getEmail(),
          "TASK_COMPLETED",
          "TASK",
          taskId
      );
    }

    return saved;
  }

  @Override
  public List<Task> getForLoggedInUser(String email) {

    Employee emp = empRepo.findByEmail(email)
        .orElseThrow(() -> new RuntimeException("Employee not found"));

    return repo.findByAssignedTo_EmpId(emp.getEmpId());
  }

  @Override
  @Transactional
  public void completeTask(Long taskId, String email) {

    Task task = repo.findById(taskId)
        .orElseThrow(() -> new RuntimeException("Task not found"));

    Employee emp = empRepo.findByEmail(email)
        .orElseThrow(() -> new RuntimeException("Employee not found"));

    if (!task.getAssignedTo().getEmpId().equals(emp.getEmpId())) {
      throw new RuntimeException("You can only complete your own task");
    }

    commentRepo.deleteByTask_TaskId(taskId);

    TaskHistory history = new TaskHistory();
    copyToHistory(task, history);
    history.setFinalStatus(TaskStatus.DONE);
    history.setCompletedAt(LocalDateTime.now());

    historyRepo.save(history);
    repo.delete(task);

    auditService.log(
        email,
        "TASK_COMPLETED",
        "TASK",
        taskId
    );
  }

  @Override
  @Transactional
  public void deleteTask(Long taskId) {

    Task task = repo.findById(taskId)
        .orElseThrow(() -> new RuntimeException("Task not found"));

    String email = SecurityContextHolder.getContext()
        .getAuthentication()
        .getName();

    commentRepo.deleteByTask_TaskId(taskId);

    TaskHistory history = new TaskHistory();
    copyToHistory(task, history);
    history.setFinalStatus(TaskStatus.DELETED);
    history.setDeletedAt(LocalDateTime.now());

    historyRepo.save(history);
    repo.delete(task);

    auditService.log(
        email,
        "TASK_DELETED",
        "TASK",
        taskId
    );
  }

  @Override
  public List<TaskHistory> getMyHistory(String email) {

    Employee emp = empRepo.findByEmail(email)
        .orElseThrow(() -> new RuntimeException("Employee not found"));

    return historyRepo.findByAssignedTo(emp.getEmpId());
  }

  @Override
  public List<TaskHistory> getAllHistory() {
    return historyRepo.findAll();
  }

  private void copyToHistory(Task task, TaskHistory history) {

    history.setTaskId(task.getTaskId());
    history.setTitle(task.getTitle());
    history.setDescription(task.getDescription());
    history.setDueDate(task.getDueDate());
    history.setPriority(task.getPriority());
    history.setAssignedTo(task.getAssignedTo().getEmpId());
  }
}