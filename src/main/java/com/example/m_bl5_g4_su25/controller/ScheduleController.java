package com.example.m_bl5_g4_su25.controller;


import com.example.m_bl5_g4_su25.dto.response.ScheduleResponse;
import com.example.m_bl5_g4_su25.entity.Schedule;
import com.example.m_bl5_g4_su25.service.ScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/schedules")
public class ScheduleController {

    private final ScheduleService scheduleService;

    @Autowired
    public ScheduleController(ScheduleService scheduleService) {
        this.scheduleService = scheduleService;
    }

    @GetMapping("/by-class/{classId}")
    public ResponseEntity<List<ScheduleResponse>> getSchedulesByClassId(@PathVariable Long classId) {
        return ResponseEntity.ok(scheduleService.getSchedulesByClassId(classId));
    }


    @GetMapping("/{scheduleId}")
    public ResponseEntity<Schedule> getScheduleById(@PathVariable Long scheduleId) {
        return scheduleService.getScheduleById(scheduleId)
                .map(schedule -> new ResponseEntity<>(schedule, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<Schedule> addSchedule(@RequestBody Schedule schedule) {
        Schedule newSchedule = scheduleService.addSchedule(schedule);
        return new ResponseEntity<>(newSchedule, HttpStatus.CREATED);
    }


    @PutMapping("/{scheduleId}")
    public ResponseEntity<Schedule> editSchedule(@PathVariable Long scheduleId, @RequestBody Schedule updatedSchedule) {
        try {
            Schedule editedSchedule = scheduleService.editSchedule(scheduleId, updatedSchedule);
            return new ResponseEntity<>(editedSchedule, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    @DeleteMapping("/{scheduleId}")
    public ResponseEntity<Void> deleteSchedule(@PathVariable Long scheduleId) {
        try {
            scheduleService.deleteSchedule(scheduleId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}