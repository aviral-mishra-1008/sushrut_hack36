package com.sushrut.backend.exception;

public class InvalidDoctorException extends RuntimeException {
    public InvalidDoctorException(String message) {
        super(message);
    }
}
