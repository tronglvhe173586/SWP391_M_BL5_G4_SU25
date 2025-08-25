package com.example.m_bl5_g4_su25.dto.response;

import com.example.m_bl5_g4_su25.enums.Gender;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class LearnerProfileResponse {
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private Gender gender;
    private LocalDate dateOfBirth;
    private String province;
    private String address;
    private String phoneNumber;

}
