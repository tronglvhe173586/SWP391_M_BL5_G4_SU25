package com.example.m_bl5_g4_su25.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserResponse {
    Long id;
    String username;
    String firstName;
    String lastName;
    String email;
    String role;
    String gender;
    LocalDate dateOfBirth;
    Long provinceId;
    String provinceName;
}