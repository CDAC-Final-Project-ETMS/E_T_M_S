package com.etms.service;

import java.util.List;

import com.etms.dto.TaskRequest;
import com.etms.entity.Task;
import com.etms.entity.TaskHistory;
import com.etms.enums.TaskStatus;

public interface TaskService {
    Task createFromRequest(TaskRequest request);
    List<Task> getByEmployee(Long empId);
    List<Task> getAll();
    Task updateStatus(Long taskId, TaskStatus status);
    List<Task> getForLoggedInUser(String email);
    void completeTask(Long taskId, String email);
    void deleteTask(Long taskId);
    List<TaskHistory> getMyHistory(String email);
    List<TaskHistory> getAllHistory();



}

