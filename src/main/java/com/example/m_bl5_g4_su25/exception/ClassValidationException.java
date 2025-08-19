package com.example.m_bl5_g4_su25.exception;

public class ClassValidationException extends RuntimeException {

    public ClassValidationException(String message) {
        super(message);
    }

    public ClassValidationException(String message, Throwable cause) {
        super(message, cause);
    }
}