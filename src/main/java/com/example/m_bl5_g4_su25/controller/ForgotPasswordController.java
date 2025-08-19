package com.example.m_bl5_g4_su25.controller;

import com.example.m_bl5_g4_su25.dto.request.ChangePasswordRequest;
import com.example.m_bl5_g4_su25.service.ForgotPasswordService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/forgot-password")
@RequiredArgsConstructor
public class ForgotPasswordController {
    private final ForgotPasswordService forgotPasswordService;

    @PostMapping("/verify-email/{email}")
    public ResponseEntity<String> verifyEmail(@PathVariable String email) {
        forgotPasswordService.processForgotPasswordRequest(email);
        return ResponseEntity.ok("Email sent for verification. Please check your inbox.");
    }

    @PostMapping("/verify-otp/{otp}/{email}")
    public ResponseEntity<String> verifyOTP(@PathVariable Integer otp, @PathVariable String email) {
        try {
            forgotPasswordService.verifyOtp(otp, email);
            return ResponseEntity.ok("OTP verified. You can now change your password.");
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.EXPECTATION_FAILED);
        }
    }


    @PostMapping("/change-password/{email}")
    public ResponseEntity<String> changePasswordHandler(
            @RequestBody ChangePasswordRequest changePasswordRequest,
            @PathVariable String email) {
        try {
            forgotPasswordService.changePassword(
                    email,
                    changePasswordRequest.password(),
                    changePasswordRequest.repeatPassword()
            );
            return ResponseEntity.ok("Password has been changed!");
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

}
