package com.sushrut.backend.service;

import com.sushrut.backend.dto.*;
import com.sushrut.backend.entity.Doctor;
import com.sushrut.backend.entity.MedicalHistory;
import com.sushrut.backend.entity.User;
import com.sushrut.backend.enums.Role;
import com.sushrut.backend.repository.DoctorRepository;
import com.sushrut.backend.repository.MedicalHistoryRepository;
import com.sushrut.backend.repository.UserRepository;
import com.sushrut.backend.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final MedicalHistoryRepository medicalHistoryRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Transactional
    public User patientSignup(PatientSignupDTO signupDTO) {
        // Check if email already exists
        if (userRepository.existsByEmail(signupDTO.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        // Create user
        User user = User.builder()
                .name(signupDTO.getName())
                .email(signupDTO.getEmail())
                .hashPassword(passwordEncoder.encode(signupDTO.getPassword()))
                .phNumber(signupDTO.getPhNumber())
                .gender(signupDTO.getGender())
                .role(Role.PATIENT)
                .build();

        MedicalHistory medicalHistory = MedicalHistory.builder()
                .user(user)
                .bloodGroup(signupDTO.getBloodGroup())
                .height(signupDTO.getHeight())
                .weight(signupDTO.getWeight())
                .diseases(signupDTO.getDiseases())
                .familyDiseases(signupDTO.getFamilyDiseases())
                .allergies(signupDTO.getAllergies())
                .build();

        user.setMedicalHistory(medicalHistory);
        return userRepository.save(user);


    }

    @Transactional
    public Doctor doctorSignup(DoctorSignupDTO signupDTO) {
        // Check if email or license number already exists
        if (userRepository.existsByEmail(signupDTO.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        if (doctorRepository.existsByLicenseNumber(signupDTO.getLicenseNumber())) {
            throw new RuntimeException("License number already exists");
        }

        // Create user
        User user = User.builder()
                .name(signupDTO.getName())
                .email(signupDTO.getEmail())
                .hashPassword(passwordEncoder.encode(signupDTO.getPassword()))
                .phNumber(signupDTO.getPhNumber())
                .gender(signupDTO.getGender())
                .role(Role.DOCTOR)
                .build();
        userRepository.save(user);

        // Create doctor
        Doctor doctor = Doctor.builder()
                .user(user)
                .licenseNumber(signupDTO.getLicenseNumber())
                .department(signupDTO.getDepartment())
                .experienceYears(signupDTO.getExperienceYears())
                .consultationFee(signupDTO.getConsultationFee())
                .qualification(signupDTO.getQualification())
                .hospitalName(signupDTO.getHospitalName())
                .address(signupDTO.getAddress())
                .city(signupDTO.getCity())
                .rating(2.5) // Explicitly set default rating
                .state(signupDTO.getState())
                .build();

        return doctorRepository.save(doctor);
    }

    public String login(LoginDTO loginDTO) {
        User user = userRepository.findByEmail(loginDTO.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(loginDTO.getPassword(), user.getHashPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        return jwtTokenProvider.generateToken(user.getEmail(), user.getRole().name());
    }

}