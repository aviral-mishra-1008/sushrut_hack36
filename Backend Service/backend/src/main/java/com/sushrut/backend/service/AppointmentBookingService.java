package com.sushrut.backend.service;

import com.sushrut.backend.dto.AppointmentBookingRequest;
import com.sushrut.backend.dto.AppointmentBookingResponse;

public interface AppointmentBookingService {
    public AppointmentBookingResponse confirmBooking(AppointmentBookingRequest request);
}
