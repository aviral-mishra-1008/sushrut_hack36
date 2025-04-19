package com.sushrut.backend.controller;

import com.sushrut.backend.dto.AppointmentBookingRequest;
import com.sushrut.backend.dto.AppointmentBookingResponse;
import com.sushrut.backend.exception.InvalidPaymentException;
import com.sushrut.backend.service.AppointmentBookingServiceImplementation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("/api/appointment")
@RequiredArgsConstructor
public class AppointmentController {
    private final AppointmentBookingServiceImplementation appointmentBookingService;

    @PostMapping("/confirmBooking")
    public ResponseEntity<AppointmentBookingResponse> confirmBooking(@RequestBody AppointmentBookingRequest appointmentBookingRequest){
        try{
            AppointmentBookingResponse response = appointmentBookingService.confirmBooking(appointmentBookingRequest);
            return ResponseEntity.ok(response);
        } catch(InvalidPaymentException e){
            return ResponseEntity.badRequest().build();
        }
        catch (Exception e) {
            throw new RuntimeException("Error is " + e.getMessage());
        }
    }
}
