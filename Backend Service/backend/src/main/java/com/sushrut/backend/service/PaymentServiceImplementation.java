package com.sushrut.backend.service;

import com.sushrut.backend.dto.PaymentRequest;
import com.sushrut.backend.dto.PaymentResponse;
import com.sushrut.backend.entity.Doctor;
import com.sushrut.backend.entity.Payment;
import com.sushrut.backend.entity.User;
import com.sushrut.backend.enums.PaymentStatus;
import com.sushrut.backend.exception.InvalidDoctorException;
import com.sushrut.backend.exception.InvalidUserException;
import com.sushrut.backend.repository.DoctorRepository;
import com.sushrut.backend.repository.PaymentRepository;
import com.sushrut.backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PaymentServiceImplementation implements PaymentService {
    private final PaymentRepository paymentRepository;
    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;

    @Transactional
    @Override
    public PaymentResponse confirmPayment(PaymentRequest request){
        User user = userRepository.findById(request.getPatientID())
                .orElseThrow(() -> new InvalidUserException("Patient not found."));
        Doctor doctor = doctorRepository.findById(request.getDoctorID())
                .orElseThrow(() -> new InvalidDoctorException("Doctor not found."));
        String transaction = "ABCD";
        Payment payment = Payment.builder()
                .patient(user)
                .doctor(doctor)
                .amount(request.getAmount())
                .status(PaymentStatus.COMPLETED)
                .transactionId(transaction)
                .dateTime(request.getDateTime())
                .build();

        paymentRepository.save(payment);

        return PaymentResponse.builder()
                .paymentID(payment.getPaymentId())
                .transactionID(payment.getTransactionId())
                .success(true)
                .build();

    }
}
