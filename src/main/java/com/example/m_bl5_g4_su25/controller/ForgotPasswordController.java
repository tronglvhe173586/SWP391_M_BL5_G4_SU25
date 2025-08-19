package com.example.m_bl5_g4_su25.controller;

import com.example.m_bl5_g4_su25.dto.request.ChangePasswordRequest;
import com.example.m_bl5_g4_su25.dto.request.MailBody;
import com.example.m_bl5_g4_su25.entity.ForgotPassword;
import com.example.m_bl5_g4_su25.entity.User;
import com.example.m_bl5_g4_su25.repository.ForgotPasswordRepository;
import com.example.m_bl5_g4_su25.repository.UserRepository;
import com.example.m_bl5_g4_su25.service.EmailService;
import com.example.m_bl5_g4_su25.service.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.MailSender;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@RestController
@RequestMapping("/forgot-password")
@RequiredArgsConstructor
public class ForgotPasswordController {
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final ForgotPasswordRepository forgotPasswordRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/verify-email/{email}")
    @Transactional // Đảm bảo toàn bộ hoạt động diễn ra trong một giao dịch
    public ResponseEntity<String> verifyEmail(@PathVariable String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Please provide a valid email."));

        Optional<ForgotPassword> existingFp = forgotPasswordRepository.findByUser(user);

        int otp = otpGenerator();
        ForgotPassword fp;

        if (existingFp.isPresent()) {
            fp = existingFp.get();
            fp.setOtp(otp);
            fp.setExpirationTime(new Date(System.currentTimeMillis() + 30 * 1000));
        } else {
            fp = ForgotPassword.builder()
                    .otp(otp)
                    .expirationTime(new Date(System.currentTimeMillis() + 30 * 1000))
                    .user(user)
                    .build();
        }

        forgotPasswordRepository.save(fp);

        MailBody mailBody = MailBody.builder()
                .to(email)
                .text("This is the OTP code for your forgot password request: " + otp)
                .subject("OTP Code for Forgot Password request")
                .build();
        emailService.sendSimpleMessage(mailBody);

        return ResponseEntity.ok("Email sent for verification. Please check your inbox.");
    }

    @PostMapping("/verify-otp/{otp}/{email}")
    @Transactional
    public ResponseEntity<String> verifyOTP(@PathVariable Integer otp, @PathVariable String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Please provide a valid email!"));

        ForgotPassword fg = forgotPasswordRepository.findByOtpAndUser(otp, user)
                .orElseThrow(() -> new RuntimeException("Invalid OTP for email: " + email));

        if (fg.getExpirationTime().before(Date.from(Instant.now()))) {
            forgotPasswordRepository.deleteById(fg.getFid());
            return new ResponseEntity<>("OTP has expired!", HttpStatus.EXPECTATION_FAILED);
        }

        forgotPasswordRepository.deleteById(fg.getFid());
        return ResponseEntity.ok("OTP verified");
    }

    @PostMapping("/change-password/{email}")
    public ResponseEntity<String> changePasswordHandler(@RequestBody ChangePasswordRequest changePasswordRequest,
                                                        @PathVariable String email) {
        if (!Objects.equals(changePasswordRequest.password(), changePasswordRequest.repeatPassword())) {
            return new ResponseEntity<>("Please enter the password again!", HttpStatus.EXPECTATION_FAILED);
        }
        String encodedPassword = passwordEncoder.encode(changePasswordRequest.password());
        userRepository.updatePassword(email, encodedPassword);
        return ResponseEntity.ok("Password has been changed!");
    }

    private Integer otpGenerator() {;
        return (int) (Math.random() * 9000) + 1000;
    }
}
