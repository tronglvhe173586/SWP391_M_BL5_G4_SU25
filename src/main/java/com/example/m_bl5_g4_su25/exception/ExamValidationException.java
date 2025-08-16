package com.example.m_bl5_g4_su25.exception;

public class ExamValidationException extends RuntimeException {

    public ExamValidationException(String message) {
        super(message);
    }

    public ExamValidationException(String message, Throwable cause) {
        super(message, cause);
    }
}
