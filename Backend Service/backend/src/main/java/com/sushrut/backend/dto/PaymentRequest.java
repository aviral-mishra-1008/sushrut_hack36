package com.sushrut.backend.dto;

import lombok.Data;
import lombok.ToString;

import java.time.LocalDateTime;

@Data
@ToString
public class PaymentRequest {
    private String patientID;
    private String doctorID;
    private Double amount;
    private LocalDateTime dateTime;
}
