package com.example.m_bl5_g4_su25.service;

import com.example.m_bl5_g4_su25.dto.request.ExamScheduleCreateRequest;
import com.example.m_bl5_g4_su25.dto.response.ExamScheduleResponse;
import com.example.m_bl5_g4_su25.entity.ExamSchedule;
import com.example.m_bl5_g4_su25.entity.Exam;
import com.example.m_bl5_g4_su25.entity.Class;
import com.example.m_bl5_g4_su25.entity.User;
import com.example.m_bl5_g4_su25.repository.ExamScheduleRepository;
import com.example.m_bl5_g4_su25.repository.ExamRepository;
import com.example.m_bl5_g4_su25.repository.ClassRepository;
import com.example.m_bl5_g4_su25.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExamScheduleService implements IExamScheduleService {

        @Autowired
        private ExamScheduleRepository examScheduleRepository;

        @Autowired
        private ExamRepository examRepository;

        @Autowired
        private ClassRepository classRepository;

        @Autowired
        private UserRepository userRepository;

        @Override
        public List<ExamScheduleResponse> getAllExamSchedules() {
                List<ExamSchedule> examSchedules = examScheduleRepository.findAll();
                return examSchedules.stream()
                                .map(this::convertToResponse)
                                .collect(Collectors.toList());
        }

        @Override
        public ExamScheduleResponse createExamSchedule(ExamScheduleCreateRequest request) {
                // Validate exam exists
                Exam exam = examRepository.findById(request.getExamId())
                                .orElseThrow(() -> new RuntimeException(
                                                "Exam not found with id: " + request.getExamId()));

                // Create new exam schedule
                ExamSchedule examSchedule = new ExamSchedule();
                examSchedule.setExam(exam);
                examSchedule.setExamDate(request.getExamDate());
                examSchedule.setStartTime(request.getStartTime());
                examSchedule.setLocation(request.getLocation());
                examSchedule.setMaxParticipants(request.getMaxParticipants());

                // Set class if provided
                if (request.getClassId() != null) {
                        Class classField = classRepository.findById(request.getClassId())
                                        .orElseThrow(() -> new RuntimeException(
                                                        "Class not found with id: " + request.getClassId()));
                        examSchedule.setClassField(classField);
                }

                // Set instructor if provided
                if (request.getInstructorId() != null) {
                        User instructor = userRepository.findById(request.getInstructorId())
                                        .orElseThrow(() -> new RuntimeException(
                                                        "Instructor not found with id: " + request.getInstructorId()));
                        examSchedule.setInstructor(instructor);
                }

                // Save and return
                ExamSchedule savedExamSchedule = examScheduleRepository.save(examSchedule);
                return convertToResponse(savedExamSchedule);
        }

        private ExamScheduleResponse convertToResponse(ExamSchedule examSchedule) {
                return new ExamScheduleResponse(
                                examSchedule.getId(),
                                examSchedule.getExam().getExamName(),
                                examSchedule.getClassField() != null ? examSchedule.getClassField().getClassName()
                                                : null,
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
