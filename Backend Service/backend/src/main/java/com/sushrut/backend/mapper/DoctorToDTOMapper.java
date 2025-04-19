package com.sushrut.backend.mapper;


/*
    MAPPER is a special class type in Java that basically
    converts the two different object types kind of mapping them
    this is often needed when we map the Database entities to the
    DTOs
 */

import com.sushrut.backend.dto.DoctorListItemDTO;
import com.sushrut.backend.entity.Doctor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class DoctorToDTOMapper{
    public DoctorListItemDTO toDoctorDTO(Doctor doctor) {
        if(doctor == null) {
            return null;
        }

        return DoctorListItemDTO.builder()
                .doctorId(doctor.getDoctorId())
                .name(doctor.getUser().getName())
                .email(doctor.getUser().getEmail())
                .rating(doctor.getRating())
                .consultationFee(doctor.getConsultationFee())
                .qualification(doctor.getQualification())
                .hospitalName(doctor.getHospitalName())
                .address(doctor.getAddress())
                .city(doctor.getCity())
                .state(doctor.getState())
                .experienceYears(doctor.getExperienceYears())
                .build();
    }

    public List<DoctorListItemDTO> toDoctorDTOList(List<Doctor> doctors){
        /*
            This is how the given code works:
            Takes in a List of Doctor Items then converts it to stream which is basically a breakdown of the object structure to provide means of processing
            Then we map to each item in stream a function to perform that function on each item, kind of like lambda function in python
            Then this::toDoctorDTO means that we wish to apply this.toDoctorDTO method to each item
            i.e for each doctor in doctors, doctor = this.toDoctorDTO(doctor)
            lastly we use the collections framework to collect the updated stream and return a list object
         */
        return doctors.stream()
                .map(this::toDoctorDTO)
                .collect(Collectors.toList());
    }
}
