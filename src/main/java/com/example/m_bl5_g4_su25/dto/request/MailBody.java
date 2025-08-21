package com.example.m_bl5_g4_su25.dto.request;

import lombok.Builder;

@Builder
public record MailBody(String to, String subject, String text) {
}
