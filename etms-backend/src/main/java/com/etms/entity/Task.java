package com.etms.entity;

import java.time.LocalDate;

import com.etms.enums.Priority;
import com.etms.enums.TaskStatus;

import jakarta.persistence.*;
import lombok.Data;
@Entity
@Table(name = "tasks")
@Data
public class Task {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long taskId;

  private String title;

  private String description;

  @Enumerated(EnumType.STRING)
  private TaskStatus status;

  private LocalDate dueDate;   // ✅ FIXED

  @Enumerated(EnumType.STRING)
  private Priority priority;  // ✅ FIXED

  @ManyToOne
  @JoinColumn(name = "assigned_to")
  private Employee assignedTo;
}
