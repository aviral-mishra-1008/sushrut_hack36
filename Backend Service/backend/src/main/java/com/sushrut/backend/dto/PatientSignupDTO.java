package com.sushrut.backend.dto;

import lombok.*;

import java.util.List;

@Data
@EqualsAndHashCode(callSuper = false)
@NoArgsConstructor
@AllArgsConstructor
public class PatientSignupDTO extends UserSignupDTO {
    private String bloodGroup;
    private Double height;
    private Double weight;
    private List<String> diseases;
    private List<String> familyDiseases;
    private List<String> allergies;
}
