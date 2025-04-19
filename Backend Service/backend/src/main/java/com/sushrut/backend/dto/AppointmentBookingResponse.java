package com.sushrut.backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AppointmentBookingResponse {
    private String appointmentId;
    private String message;
    private boolean success;
}
