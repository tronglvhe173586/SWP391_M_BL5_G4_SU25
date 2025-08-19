package com.example.m_bl5_g4_su25.service;

import com.example.m_bl5_g4_su25.dto.request.MailBody;
import com.example.m_bl5_g4_su25.entity.ForgotPassword;
import com.example.m_bl5_g4_su25.entity.User;
import com.example.m_bl5_g4_su25.repository.ForgotPasswordRepository;
import com.example.m_bl5_g4_su25.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Date;
import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ForgotPasswordService implements IForgotPasswordService {
    private final ForgotPasswordRepository forgotPasswordRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void processForgotPasswordRequest(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Please provide a valid email."));

        int otp = otpGenerator();
        Optional<ForgotPassword> existingFp = forgotPasswordRepository.findByUser(user);
        ForgotPassword fp;

        if (existingFp.isPresent()) {
            fp = existingFp.get();
            fp.setOtp(otp);
            fp.setExpirationTime(new Date(System.currentTimeMillis() + 5 * 60 * 1000));
        } else {
            fp = ForgotPassword.builder()
                    .otp(otp)
                    .expirationTime(new Date(System.currentTimeMillis() + 5 * 60 * 1000))
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
    }

    @Override
    @Transactional
    public void verifyOtp(Integer otp, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Please provide a valid email!"));

        ForgotPassword fg = forgotPasswordRepository.findByOtpAndUser(otp, user)
                .orElseThrow(() -> new RuntimeException("Mã OTP không hợp lệ hoặc đã hết hạn."));

        if (fg.getExpirationTime().before(Date.from(Instant.now()))) {
            forgotPasswordRepository.delete(fg);
            throw new RuntimeException("OTP has expired!");
        }
        forgotPasswordRepository.delete(fg);

    }

    @Override
    @Transactional
    public void changePassword(String email, String newPassword, String repeatPassword) {
        if (!Objects.equals(newPassword, repeatPassword)) {
            throw new IllegalArgumentException("Passwords do not match!");
        }

        String encodedPassword = passwordEncoder.encode(newPassword);
        userRepository.updatePassword(email, encodedPassword);
    }

    private Integer otpGenerator() {
        return (int) (Math.random() * 9000) + 1000;
    }
}
