package com.etms.controller;

import com.etms.service.EmployeeService;
import com.etms.entity.Employee;

import lombok.RequiredArgsConstructor;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin("*")
@RequiredArgsConstructor
public class EmployeeController {

  private final EmployeeService service;

  @PreAuthorize("hasRole('ADMIN')")
  @PostMapping
  public Employee create(@RequestBody Employee emp) {
    return service.create(emp);
  }
  
  @PreAuthorize("hasRole('ADMIN')")
  @GetMapping
  public List<Employee> getAllEmployees() {
      return service.getActive();
  }



  @GetMapping("/active")
  public List<Employee> active() {
    return service.getActive();
  }

  @PreAuthorize("hasRole('ADMIN')")
  @DeleteMapping("/{id}")
  public void deactivate(@PathVariable Long id) {
    service.deactivate(id);
  }

}
