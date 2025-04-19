package com.sushrut.backend.dto;

import com.sushrut.backend.enums.TestType;
import lombok.Data;

@Data
public class TestBookingRequestDTO {
    private String patientId;  // ID of the patient booking the test
    private String name;       // Name of the test
    private TestType testType; // Type of test (PATHOLOGY or RADIOLOGY)
}