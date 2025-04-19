package com.sushrut.backend.service;

import com.sushrut.backend.dto.AppointmentBookingRequest;
import com.sushrut.backend.dto.AppointmentBookingResponse;
import com.sushrut.backend.entity.Appointment;
import com.sushrut.backend.entity.Payment;
import com.sushrut.backend.enums.AppointmentStatus;
import com.sushrut.backend.enums.PaymentStatus;
import com.sushrut.backend.exception.InvalidPaymentException;
import com.sushrut.backend.repository.AppointmentRepository;
import com.sushrut.backend.repository.DoctorRepository;
import com.sushrut.backend.repository.PaymentRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AppointmentBookingServiceImplementation implements AppointmentBookingService {
    private final AppointmentRepository appointmentRepository;
    private final PaymentRepository paymentRepository;
    private final DoctorRepository doctorRepository;

    @Transactional
    @Override
    /*
        Since we all operations to be performed following ACID properties and be atomic as we do
        not want this transaction to fail and lead to inconsistencies in database or perhaps produce duplicates
        So, for most API Service where we wish to actually play with the database and perform W-R, R-W or W-W operation
        its a good practice to use the annotation @Transactional, it makes all transactions to rollback if any exception
        occurs!
     */
    public AppointmentBookingResponse confirmBooking(AppointmentBookingRequest request){
        Payment payment = paymentRepository.findById(request.getPaymentId())
                .orElseThrow(() -> new InvalidPaymentException("Payment not found"));

        if(payment.getStatus() != PaymentStatus.COMPLETED){
            throw new InvalidPaymentException("Payment status is not completed, Current Status: "+payment.getStatus());
        }

        Appointment appointment = Appointment.builder()
                .patient(payment.getPatient())
                .doctor(doctorRepository.findById(request.getDoctorID())
                        .orElseThrow(() -> new RuntimeException("Doctor not found"))
                )
                .appointmentDateTime(request.getAppointmentDateTime())
                .status(AppointmentStatus.SCHEDULED)
                .payment(payment)
                .build();

        appointmentRepository.save(appointment);

        return AppointmentBookingResponse.builder()
                .appointmentId(appointment.getAppointmentId())
                .message("Appointment booked")
                .success(true)
                .build();
    }
}
