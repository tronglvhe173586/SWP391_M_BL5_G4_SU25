package com.example.m_bl5_g4_su25.service;

import com.example.m_bl5_g4_su25.dto.response.ExamScheduleResponse;
import com.example.m_bl5_g4_su25.entity.ExamSchedule;
import com.example.m_bl5_g4_su25.repository.ExamScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExamScheduleService implements IExamScheduleService {

    @Autowired
    private ExamScheduleRepository examScheduleRepository;

    @Override
    public List<ExamScheduleResponse> getAllExamSchedules() {
        List<ExamSchedule> examSchedules = examScheduleRepository.findAll();
        return examSchedules.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    private ExamScheduleResponse convertToResponse(ExamSchedule examSchedule) {
        return new ExamScheduleResponse(
                examSchedule.getId(),
                examSchedule.getExam().getExamName(),
                examSchedule.getClassField() != null ? examSchedule.getClassField().getClassName() : null,
                examSchedule.getExamDate(),
                examSchedule.getStartTime(),
                examSchedule.getLocation(),
                examSchedule.getMaxParticipants(),
                examSchedule.getInstructor() != null
                        ? (examSchedule.getInstructor().getFirstName() + " "
                                + examSchedule.getInstructor().getLastName())
                        : null);
    }
}
