package com.sushrut.backend.dto;

import com.sushrut.backend.entity.Doctor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LLMResponseToFrontend {
    private String department;         // From LLM response
    private String description;        // From LLM response
    private List<DoctorListItemDTO> doctors;   // Doctors matching department
    private int totalResults;          // Count of doctors
}
