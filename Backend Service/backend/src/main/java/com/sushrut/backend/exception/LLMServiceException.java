package com.sushrut.backend.exception;

public class LLMServiceException extends RuntimeException {

    public LLMServiceException(String message) {
        super(message);
    }
}
