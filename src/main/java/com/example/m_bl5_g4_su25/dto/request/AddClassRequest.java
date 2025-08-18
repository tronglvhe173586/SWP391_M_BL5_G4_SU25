package com.example.m_bl5_g4_su25.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AddClassRequest {
    @NotNull
    Long courseId;

    @NotNull
    String className;

    @NotNull
    LocalDate startDate;

    @NotNull
    LocalDate endDate;

    @NotNull
    Integer maxStudents;

    @NotNull
    Long instructorId;
}