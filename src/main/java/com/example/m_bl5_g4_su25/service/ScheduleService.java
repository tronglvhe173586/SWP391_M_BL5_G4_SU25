package com.example.m_bl5_g4_su25.service;

import com.example.m_bl5_g4_su25.dto.response.ScheduleResponse;
import com.example.m_bl5_g4_su25.entity.Schedule;
import com.example.m_bl5_g4_su25.repository.ScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
@Service
public class ScheduleService {
    private final ScheduleRepository scheduleRepository;

    @Autowired
    public ScheduleService(ScheduleRepository scheduleRepository) {
        this.scheduleRepository = scheduleRepository;
    }

    public List<ScheduleResponse> getSchedulesByClassId(Long classId) {
        return scheduleRepository.findByClassFieldId(classId).stream()
                .map(s -> new ScheduleResponse(
                        s.getId(),
                        s.getDayOfWeek(),
                        s.getDate(),
                        s.getStartTime(),
                        s.getEndTime(),
                        s.getTopic(),
                        s.getClassField().getId()
                ))
                .toList();
    }

    public Optional<Schedule> getScheduleById(Long scheduleId) {
        return scheduleRepository.findById(scheduleId);
    }

    public Schedule addSchedule(Schedule schedule) {
        List<Schedule> overlappingSchedules = scheduleRepository.findOverlappingSchedules(
                schedule.getClassField().getId(),
                schedule.getDate(),
                schedule.getStartTime(),
                schedule.getEndTime()
        );

        if (!overlappingSchedules.isEmpty()) {
            throw new RuntimeException("Lịch học đã bị trùng, vui lòng chọn slot khác.");
        }

        return scheduleRepository.save(schedule);
    }

    public Schedule editSchedule(Long scheduleId, Schedule updatedSchedule) {
        Optional<Schedule> existingSchedule = scheduleRepository.findById(scheduleId);
        if (existingSchedule.isPresent()) {
            Schedule schedule = existingSchedule.get();
            schedule.setDayOfWeek(updatedSchedule.getDayOfWeek());
            schedule.setDate(updatedSchedule.getDate());
            schedule.setStartTime(updatedSchedule.getStartTime());
            schedule.setEndTime(updatedSchedule.getEndTime());
            schedule.setTopic(updatedSchedule.getTopic());
            return scheduleRepository.save(schedule);
        } else {
            throw new RuntimeException("Schedule not found with ID: " + scheduleId);
        }
    }

    public void deleteSchedule(Long scheduleId) {
        if (scheduleRepository.existsById(scheduleId)) {
            scheduleRepository.deleteById(scheduleId);
        } else {
            throw new RuntimeException("Schedule not found with ID: " + scheduleId);
        }
    }

    public List<ScheduleResponse> getSchedulesForLearner() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof Jwt jwt)) {
            throw new RuntimeException("Không xác định được user đang đăng nhập");
        }

        Long learnerId = Long.valueOf(jwt.getClaim("userId").toString());

        return scheduleRepository.findByLearnerId(learnerId).stream()
                .map(s -> new ScheduleResponse(
                        s.getId(),
                        s.getDayOfWeek(),
                        s.getDate(),
                        s.getStartTime(),
                        s.getEndTime(),
                        s.getTopic(),
                        s.getClassField().getId()
                ))
                .toList();
    }

    public List<ScheduleResponse> getSchedulesForInstructor() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof Jwt jwt)) {
            throw new RuntimeException("Không xác định được user đang đăng nhập");
        }

        Long instructorId = Long.valueOf(jwt.getClaim("userId").toString());

        return scheduleRepository.findByInstructorId(instructorId).stream()
                .map(s -> new ScheduleResponse(
                        s.getId(),
                        s.getDayOfWeek(),
                        s.getDate(),
                        s.getStartTime(),
                        s.getEndTime(),
                        s.getTopic(),
                        s.getClassField().getId()
                ))
                .toList();
    }
}
