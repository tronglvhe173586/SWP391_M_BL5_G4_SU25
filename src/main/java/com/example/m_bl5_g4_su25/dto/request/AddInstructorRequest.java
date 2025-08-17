package com.example.m_bl5_g4_su25.dto.request;

import java.time.LocalDate;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AddInstructorRequest {
    private String username;
    private String passwordHash;
    private String email;
    private String firstName;
    private String lastName;
    private Boolean isActive;

    private String employeeId;
    private LocalDate hireDate;
    private String certificationInfo;

}
