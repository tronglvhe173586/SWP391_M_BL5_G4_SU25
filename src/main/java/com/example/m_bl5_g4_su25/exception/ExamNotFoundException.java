package com.example.m_bl5_g4_su25.exception;

public class ExamNotFoundException extends RuntimeException {

    public ExamNotFoundException(String message) {
        super(message);
    }

    public ExamNotFoundException(Long examId) {
        super("Exam not found with id: " + examId);
    }
}
