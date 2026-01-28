package com.etms.scheduler;

import java.time.LocalDate;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.etms.entity.Task;
import com.etms.enums.TaskStatus;
import com.etms.repository.TaskRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class TaskReminderScheduler {

  private final TaskRepository repo;

  // runs daily at midnight
  @Scheduled(cron = "0 0 0 * * ?")
  public void markOverdueTasks() {

    List<Task> overdueTasks =
        repo.findByDueDateBeforeAndStatusNot(LocalDate.now(), TaskStatus.DONE);

    for (Task task : overdueTasks) {
        task.setStatus(TaskStatus.OVERDUE);
        repo.save(task);
    }

    System.out.println("Overdue tasks updated: " + overdueTasks.size());
  }
}
