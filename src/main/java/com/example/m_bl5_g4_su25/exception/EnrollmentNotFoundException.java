package com.example.m_bl5_g4_su25.exception;

public class EnrollmentNotFoundException extends RuntimeException {

    public EnrollmentNotFoundException(String message) {
        super(message);
    }

    public EnrollmentNotFoundException(Long enrollmentId) {
        super("Đăng ký không tìm thấy với ID: " + enrollmentId);
    }
}