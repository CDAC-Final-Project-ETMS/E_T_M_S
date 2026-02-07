package com.etms.entity;

import jakarta.persistence.*;
import lombok.*;

import com.etms.enums.Status;

@Entity
@Table(name = "employees")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Employee {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long empId;

  private String name;
  private String email;
  private String password;

  @Enumerated(EnumType.STRING)
  private Status status = Status.ACTIVE;

  @ManyToOne
  @JoinColumn(name = "role_id")
  private Role role;
}
