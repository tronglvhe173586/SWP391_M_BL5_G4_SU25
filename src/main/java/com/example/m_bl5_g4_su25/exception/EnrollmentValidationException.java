package com.example.m_bl5_g4_su25.exception;

public class EnrollmentValidationException extends RuntimeException {

    public EnrollmentValidationException(String message) {
        super(message);
    }

    public EnrollmentValidationException(String message, Throwable cause) {
        super(message, cause);
    }
}