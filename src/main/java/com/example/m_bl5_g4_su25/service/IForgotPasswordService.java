package com.example.m_bl5_g4_su25.service;

public interface IForgotPasswordService {
    void processForgotPasswordRequest(String email);
    void verifyOtp(Integer otp, String email);
    void changePassword(String email, String newPassword, String repeatPassword);
}
