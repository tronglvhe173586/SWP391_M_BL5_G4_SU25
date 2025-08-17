package com.example.m_bl5_g4_su25.dto.response;

import com.example.m_bl5_g4_su25.enums.Gender;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ListUserResponse {
    private Long id;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String role;
    private Boolean isActive;
    private Gender gender;
    private LocalDate dateOfBirth;
    private Instant createdAt;
    private Instant updatedAt;

    public ListUserResponse(Long id, @Size(max = 255) @NotNull String username, @Size(max = 255) @NotNull String firstName, @Size(max = 255) @NotNull String lastName, @Size(max = 255) @NotNull String email, @NotNull String role, Boolean isActive,@Size(max = 255) @NotNull Gender gender, LocalDate dateOfBirth) {
        this.id = id;
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.role = role;
        this.isActive = isActive;
        this.gender = gender;
        this.dateOfBirth = dateOfBirth;
    }
}

