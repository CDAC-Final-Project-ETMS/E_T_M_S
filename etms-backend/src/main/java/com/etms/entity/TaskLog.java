package com.etms.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "task_logs")
@Data
public class TaskLog {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long logId;

  @ManyToOne
  private Task task;

  private String oldStatus;
  private String newStatus;

  @ManyToOne
  private Employee changedBy;

  private LocalDateTime changedAt = LocalDateTime.now();
}
