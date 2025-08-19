package com.example.m_bl5_g4_su25.dto.request;

import com.example.m_bl5_g4_su25.entity.Class;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddClassRequest {

    @Size(max = 100, message = "Tên lớp không được vượt quá 100 ký tự")
    @NotNull(message = "Tên lớp là bắt buộc")
    private String className;

    @NotNull(message = "Ngày bắt đầu là bắt buộc")
    private LocalDate startDate;

    @NotNull(message = "Ngày kết thúc là bắt buộc")
    private LocalDate endDate;

    @NotNull(message = "Sĩ số tối đa là bắt buộc")
    private Integer maxStudents;

    @NotNull(message = "ID khóa học là bắt buộc")
    private Long courseId;

    @NotNull(message = "ID giảng viên là bắt buộc")
    private Long instructorId;
}