package com.sushrut.backend.exception;

public class InvalidPaymentException extends RuntimeException{
    public InvalidPaymentException(String message){
        super(message);
    }
}
