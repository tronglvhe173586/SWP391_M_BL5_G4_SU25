package com.example.m_bl5_g4_su25.exception;

public class ClassNotFoundException extends RuntimeException {

    public ClassNotFoundException(String message) {
        super(message);
    }

    public ClassNotFoundException(Long classId) {
        super("Lớp học không tìm thấy với ID: " + classId);
    }
}