package com.example.m_bl5_g4_su25.dto.response;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ListUserResponse {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String role;
    private Boolean isActive;
    private Instant createdAt;
    private Instant updatedAt;

    public ListUserResponse(Long id, @Size(max = 255) @NotNull String username, @Size(max = 255) @NotNull String fullName, @Size(max = 255) @NotNull String email, @NotNull String role, Boolean isActive) {
        this.id = id;
        this.username = username;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
        this.isActive = isActive;
    }
}

