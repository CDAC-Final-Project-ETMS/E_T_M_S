package com.etms.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.etms.enums.Priority;
import com.etms.enums.TaskStatus;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "task_history")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskHistory {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long historyId;

  private Long taskId;
  private String title;
  private String description;
  private LocalDate dueDate;

  @Enumerated(EnumType.STRING)
  private Priority priority;

  @Enumerated(EnumType.STRING)
  private TaskStatus finalStatus;

  private Long assignedTo;

  private LocalDateTime completedAt;
  private LocalDateTime deletedAt;
}
