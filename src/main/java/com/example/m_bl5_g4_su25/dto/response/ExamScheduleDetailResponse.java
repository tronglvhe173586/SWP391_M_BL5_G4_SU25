package com.example.m_bl5_g4_su25.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExamScheduleDetailResponse {
    private Long id;
    private String examName;
    private String className;
    private String instructorName;
    private LocalDate examDate;
    private LocalTime startTime;
    private String location;
    private Integer maxParticipants;
    private List<LearnerInfo> learners;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LearnerInfo {
        private Long id;
        private String firstName;
        private String lastName;
        private String email;
        private String phone;
        private String status;
    }
}
