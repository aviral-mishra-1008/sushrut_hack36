package com.sushrut.backend.entity;

import com.sushrut.backend.enums.SummaryStatus;
import com.sushrut.backend.enums.TestBookedStatus;
import com.sushrut.backend.enums.TestType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
@Entity(name = "tests")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Test {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String TestId;

    @Column(nullable = false)
    private String name;

    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private User patient;


    @Column(name = "encrypted_pdf")
    private String encryptedPdf;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TestType testType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TestBookedStatus bookedStatus;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SummaryStatus summaryStatus;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @Column(columnDefinition = "TEXT")
    private String summary;
}