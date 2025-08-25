package com.example.m_bl5_g4_su25.service;

import com.example.m_bl5_g4_su25.dto.response.ScheduleResponse;
import com.example.m_bl5_g4_su25.entity.Schedule;
import com.example.m_bl5_g4_su25.repository.ScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
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
}
