package com.etms.service;

import com.etms.entity.Employee;
import java.util.*;

public interface EmployeeService {
  Employee create(Employee emp);
  List<Employee> getActive();
  void deactivate(Long id);
  Employee createAdmin(Employee emp);
  void changePassword(String email, String oldPassword, String newPassword);
  void resetPassword(String email, String newPassword);


}
