package com.etms.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.etms.entity.Role;
import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
  Optional<Role> findByRoleName(String roleName);
}
