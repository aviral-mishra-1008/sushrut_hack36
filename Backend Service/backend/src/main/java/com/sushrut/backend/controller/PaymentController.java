package com.sushrut.backend.controller;

import com.sushrut.backend.dto.PaymentRequest;
import com.sushrut.backend.dto.PaymentResponse;
import com.sushrut.backend.exception.InvalidPaymentException;
import com.sushrut.backend.service.PaymentServiceImplementation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {
    private final PaymentServiceImplementation paymentService;

    @PostMapping("/confirmPayment")
    public ResponseEntity<PaymentResponse> confirmPayment(@RequestBody PaymentRequest paymentRequest){
        try {
            PaymentResponse response = paymentService.confirmPayment(paymentRequest);
            return ResponseEntity.ok(response);
        } catch(InvalidPaymentException e){
            return ResponseEntity.badRequest().build();
        }
        catch (Exception e) {
            throw new RuntimeException("Error is " + e.getMessage());
        }
    }
}
