package com.example.m_bl5_g4_su25.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserCreationRequest {
    String username;
    String password;
    String email;
    String firstName;
    String lastName;
    String gender;
    LocalDate dateOfBirth;
    Long provinceId;
}