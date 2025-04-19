package com.sushrut.backend.service;

import com.sushrut.backend.dto.PaymentRequest;
import com.sushrut.backend.dto.PaymentResponse;

public interface PaymentService {
    public PaymentResponse confirmPayment(PaymentRequest request);
}
