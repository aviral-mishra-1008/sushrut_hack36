package com.sushrut.backend.repository;

import com.sushrut.backend.entity.Test;
import com.sushrut.backend.enums.TestBookedStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TestRepository extends JpaRepository<Test, String> {
    List<Test> findByPatientId(String patientId);
    List<Test> findByBookedStatus(TestBookedStatus status);
}