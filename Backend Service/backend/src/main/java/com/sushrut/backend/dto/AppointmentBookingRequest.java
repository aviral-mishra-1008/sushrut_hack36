package com.sushrut.backend.dto;

import lombok.Data;
import lombok.ToString;

import java.time.LocalDateTime;

@Data
@ToString
public class AppointmentBookingRequest {
    private String doctorID;
    private LocalDateTime appointmentDateTime;
    private String paymentId;
}
