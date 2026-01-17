package com.etms.repository;

import com.etms.entity.Task;
import com.etms.enums.TaskStatus;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

  List<Task> findByAssignedTo_EmpId(Long empId);
  List<Task> findByDueDateBeforeAndStatusNot(LocalDate date, TaskStatus status);

}
