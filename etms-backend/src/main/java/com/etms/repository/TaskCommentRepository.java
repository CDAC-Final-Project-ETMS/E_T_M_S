package com.etms.repository;

import com.etms.entity.TaskComment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TaskCommentRepository extends JpaRepository<TaskComment, Long> {

    // 🔹 Existing methods (DO NOT TOUCH)
    List<TaskComment> findByTask_TaskId(Long taskId);

    List<TaskComment> findByTask_TaskIdAndEmployee_EmpId(Long taskId, Long empId);

    // 🔥 NEW METHOD (FK FIX — REQUIRED)
    void deleteByTask_TaskId(Long taskId);
}
