package com.sushrut.backend.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DoctorListItemDTO {
    private String doctorId;
    private String name;
    private String email;
//    private String imageUrl;           //eventually add the image
//    private String licenseNumber;
    private Integer experienceYears;
    private Double consultationFee;
    private String qualification;
    private String hospitalName;
    private String address;
    private String city;
    private String state;
    private Double rating;
}

