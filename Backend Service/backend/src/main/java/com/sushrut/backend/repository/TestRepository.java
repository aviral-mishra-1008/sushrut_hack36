package com.sushrut.backend.repository;

import com.sushrut.backend.entity.Test;
import com.sushrut.backend.enums.SummaryStatus;
import com.sushrut.backend.enums.TestBookedStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TestRepository extends JpaRepository<Test, String> {
    // Change from findByPatient_Id to findByPatient_UserId
    List<Test> findByPatient_UserId(String patientId);
    List<Test> findByBookedStatus(TestBookedStatus status);
    List<Test> findBySummaryStatus(SummaryStatus status);
}