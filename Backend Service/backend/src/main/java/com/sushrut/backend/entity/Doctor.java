package com.sushrut.backend.entity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigInteger;
import java.util.Calendar;
import java.util.Date;


@Entity(name = "doctors")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Doctor {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String doctorId;

    @OneToOne(fetch=FetchType.EAGER)
    @JoinColumn(name="user_id", nullable = false)
    private User user;

    @Column(nullable = false, unique = true)
    private String licenseNumber;

    @Column(nullable = false)
    private String department;

    @Column(nullable = false)
    private Integer experienceYears;

    @Column(nullable = false)
    private Double consultationFee;

    @Column(nullable = false)
    private String qualification;

    // Workplace details
    @Column(nullable = false)
    private String hospitalName;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private String city;

    @Column(nullable = false)
    private String state;

    @Column
    private Double rating = 2.5;
}