package com.sushrut.backend.repository;

import com.sushrut.backend.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, String> {
    List<Doctor> findByDepartmentIgnoreCase(String department);
    boolean existsByLicenseNumber(String licenseNumber);
}