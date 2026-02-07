package com.etms.service.impl;

import com.etms.entity.Employee;
import com.etms.entity.Role;
import com.etms.enums.Status;
import com.etms.repository.EmployeeRepository;
import com.etms.repository.RoleRepository;
import com.etms.service.AuditService;
import com.etms.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeServiceImpl implements EmployeeService {

  private final EmployeeRepository repo;
  private final RoleRepository roleRepo;
  private final BCryptPasswordEncoder encoder;
  private final AuditService auditService;

  public EmployeeServiceImpl(EmployeeRepository repo,
          RoleRepository roleRepo,
          BCryptPasswordEncoder encoder,
          AuditService auditService) {
    this.repo = repo;
    this.roleRepo = roleRepo;
    this.encoder = encoder;
    this.auditService = auditService;
  }

  @Override
  public Employee create(Employee emp) {

    if (repo.existsByEmail(emp.getEmail())) {
      throw new RuntimeException("Email already exists");
    }

    Role role = roleRepo.findByRoleName("EMPLOYEE")
        .orElseThrow(() -> new RuntimeException("EMPLOYEE role not found"));

    emp.setRole(role);
    emp.setStatus(Status.ACTIVE);
    emp.setPassword(encoder.encode(emp.getPassword()));

    return repo.save(emp);
  }

  @Override
  public Employee createAdmin(Employee emp) {

    if (repo.existsByEmail(emp.getEmail())) {
        throw new RuntimeException("Admin already exists");
    }

    Role role = roleRepo.findByRoleName("ADMIN").orElse(null);
    if (role == null) {
        role = roleRepo.save(new Role(null, "ADMIN"));
    }

    emp.setRole(role);
    emp.setStatus(Status.ACTIVE);
    emp.setPassword(encoder.encode(emp.getPassword()));

    return repo.save(emp);
  }

  @Override
  public List<Employee> getActive() {
    return repo.findByStatus(Status.ACTIVE);
  }

  @Override
  public void deactivate(Long id) {

    String currentEmail = SecurityContextHolder.getContext()
        .getAuthentication()
        .getName();

    Employee target = repo.findById(id)
        .orElseThrow(() -> new RuntimeException("Employee not found"));

    Employee currentAdmin = repo.findByEmail(currentEmail)
        .orElseThrow(() -> new RuntimeException("Admin not found"));

    //Prevent self-deactivation for admin
    if (target.getEmpId().equals(currentAdmin.getEmpId())) {
      throw new RuntimeException("You cannot deactivate your own account");
    }

    //Prevent deactivating admin
    if ("ADMIN".equalsIgnoreCase(
            target.getRole().getRoleName())) {
      throw new RuntimeException("You cannot deactivate another admin");
    }

    target.setStatus(Status.INACTIVE);
    repo.save(target);

    auditService.log(
        currentEmail,
        "EMPLOYEE_DEACTIVATED",
        "EMPLOYEE",
        target.getEmpId()
    );
  }

  @Override
  public void changePassword(String email,
                             String oldPassword,
                             String newPassword) {

    Employee emp = repo.findByEmail(email)
        .orElseThrow(() -> new RuntimeException("Employee not found"));

    if (!encoder.matches(oldPassword, emp.getPassword())) {
      throw new RuntimeException("Old password is incorrect");
    }

    emp.setPassword(encoder.encode(newPassword));
    repo.save(emp);

    auditService.log(email,
        "PASSWORD_CHANGED",
        "EMPLOYEE",
        emp.getEmpId());
  }

  @Override
  public void resetPassword(String email, String newPassword) {

    Employee emp = repo.findByEmail(email)
        .orElseThrow(() -> new RuntimeException("Employee not found"));

    emp.setPassword(encoder.encode(newPassword));
    repo.save(emp);
  }
}
