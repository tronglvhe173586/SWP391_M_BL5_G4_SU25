package com.example.m_bl5_g4_su25.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EditClassRequest {

    @Size(max = 100, message = "Tên lớp không được vượt quá 100 ký tự")
    @NotNull(message = "Tên lớp là bắt buộc")
    private String className;

    @NotNull(message = "Ngày bắt đầu là bắt buộc")
    private LocalDate startDate;

    @NotNull(message = "Ngày kết thúc là bắt buộc")
    private LocalDate endDate;

    @NotNull(message = "Sĩ số tối đa là bắt buộc")
    private Integer maxStudents;

    private Long courseId;

    private Long instructorId;
}