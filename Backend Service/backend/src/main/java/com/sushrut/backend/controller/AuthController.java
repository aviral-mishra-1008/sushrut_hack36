package com.sushrut.backend.controller;

import com.sushrut.backend.dto.DoctorSignupDTO;
import com.sushrut.backend.dto.LoginDTO;
import com.sushrut.backend.dto.PatientSignupDTO;
import com.sushrut.backend.dto.UserSignupDTO;
import com.sushrut.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/patient/signup")
    public ResponseEntity<?> patientSignup(@Valid @RequestBody PatientSignupDTO signupDTO) {
        return ResponseEntity.ok(authService.patientSignup(signupDTO));
    }

    @PostMapping("/doctor/signup")
    public ResponseEntity<?> doctorSignup(@Valid @RequestBody DoctorSignupDTO signupDTO) {
        return ResponseEntity.ok(authService.doctorSignup(signupDTO));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginDTO loginDTO) {
        return ResponseEntity.ok(authService.login(loginDTO));
    }
}