package com.etms.dto;

import java.time.LocalDate;

import com.etms.enums.Priority;

import lombok.Data;

@Data
public class TaskRequest {
    private String title;
    private String description;
    private LocalDate dueDate;   // ✅ added
    private Priority priority;  // ✅ added
    private Long empId;
}
