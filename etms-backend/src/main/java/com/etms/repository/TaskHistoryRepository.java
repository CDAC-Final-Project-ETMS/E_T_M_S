package com.etms.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.etms.entity.TaskHistory;

public interface TaskHistoryRepository extends JpaRepository<TaskHistory, Long> {

  List<TaskHistory> findByAssignedTo(Long empId);
}
