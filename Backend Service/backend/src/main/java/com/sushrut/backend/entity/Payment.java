package com.sushrut.backend.entity;
import com.sushrut.backend.enums.PaymentStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;


@Entity(name = "payments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String PaymentId;

    @ManyToOne
    @JoinColumn(name="patient_id", nullable = false)
    private User patient;

    @ManyToOne
    @JoinColumn(name="doctor_id", nullable = false)
    private Doctor doctor;

    @Column(nullable = false)
    private Double amount;

    @Enumerated(EnumType.STRING)
    private PaymentStatus status;  //CHECK ENUMS

    @Column(unique = true)
    private String transactionId;

    @CreationTimestamp
    private LocalDateTime dateTime;
}