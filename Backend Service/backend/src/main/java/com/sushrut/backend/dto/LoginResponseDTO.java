package com.sushrut.backend.dto;

import com.sushrut.backend.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponseDTO {
    private String token;
    private String userId;
    private String name;
    private String email;
    private String phNumber;
    private String gender;
    private Role role;

    private String doctorId;
    private String licenseNumber;
    private String department;
    private Integer experienceYears;
    private Double consultationFee;
    private String qualification;
    private String hospitalName;
    private String address;
    private String city;
    private String state;
    private Double rating;

    private String medicalHistoryId;
    private String bloodGroup;
    private Double height;
    private Double weight;
    private Double bmi;
    private List<String> diseases;
    private List<String> familyDiseases;
    private List<String> allergies;
}