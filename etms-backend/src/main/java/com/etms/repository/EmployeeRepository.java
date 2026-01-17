package com.etms.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.etms.entity.Employee;
import com.etms.enums.Status;
import java.util.*;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
  Optional<Employee> findByEmail(String email);
  List<Employee> findByStatus(Status status);
  boolean existsByEmail(String email); 
  
}
