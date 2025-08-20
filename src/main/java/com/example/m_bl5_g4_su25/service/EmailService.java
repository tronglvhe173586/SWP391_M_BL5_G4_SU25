package com.example.m_bl5_g4_su25.service;

import com.example.m_bl5_g4_su25.dto.request.MailBody;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class EmailService {
    @NonFinal
    @Value("${spring.mail.username}")
    protected String GMAIL_USERNAME;

    JavaMailSender javaMailSender;

    public void sendSimpleMessage(MailBody maiBody) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(maiBody.to());
        message.setFrom(GMAIL_USERNAME);
        message.setSubject(maiBody.subject());
        message.setText(maiBody.text());

        javaMailSender.send(message);
    }
}
