package com.sushrut.backend.dto;

import jakarta.validation.constraints.NotBlank;

import lombok.*;

@Data
@EqualsAndHashCode(callSuper = false)
@NoArgsConstructor
@AllArgsConstructor
public class DoctorSignupDTO extends UserSignupDTO {
    @NotBlank(message = "License number is required")
    private String licenseNumber;

    @NotBlank(message = "Department is required")
    private String department;

    private Integer experienceYears;
    private Double consultationFee;

    @NotBlank(message = "Qualification is required")
    private String qualification;

    @NotBlank(message = "Hospital name is required")
    private String hospitalName;

    @NotBlank(message = "Address is required")
    private String address;

    @NotBlank(message = "City is required")
    private String city;

    @NotBlank(message = "State is required")
    private String state;
}