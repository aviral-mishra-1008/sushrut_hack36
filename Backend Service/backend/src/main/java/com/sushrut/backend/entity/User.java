package com.sushrut.backend.entity;

import com.sushrut.backend.enums.Role;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity(name="users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String userId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String hashPassword;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String phNumber;

    @Enumerated(EnumType.STRING)
    private Role role;

    @Column(nullable = false)
    private String gender;

    @OneToOne(mappedBy="user", cascade = CascadeType.ALL)
    private MedicalHistory medicalHistory;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public void setMedicalHistory(MedicalHistory medicalHistory) {
        this.medicalHistory = medicalHistory;
        if(medicalHistory != null) {
            medicalHistory.setUser(this);
        }
    }
}
