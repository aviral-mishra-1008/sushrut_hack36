package com.sushrut.backend.repository;

import com.sushrut.backend.entity.Doctor;
import com.sushrut.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, String> {
    List<Doctor> findByDepartmentIgnoreCase(String department);
    boolean existsByLicenseNumber(String licenseNumber);
    Optional<Doctor> findByUser(User user);
}