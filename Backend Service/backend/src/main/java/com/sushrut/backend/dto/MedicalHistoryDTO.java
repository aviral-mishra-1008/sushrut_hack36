package com.sushrut.backend.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MedicalHistoryDTO {
    private String bloodGroup;
    private Double height;
    private Double weight;
    private String diseases;
    private String familyDiseases;
    private String allergies;
}
