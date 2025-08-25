package com.example.m_bl5_g4_su25.repository;

import com.example.m_bl5_g4_su25.entity.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    List<Schedule> findByClassFieldId(Long classId);
    @Query("SELECT s FROM Schedule s WHERE s.classField.id = :classId " +
            "AND s.date = :date " +
            "AND ((s.startTime < :endTime AND s.endTime > :startTime))")
    List<Schedule> findOverlappingSchedules(@Param("classId") Long classId,
                                            @Param("date") LocalDate date,
                                            @Param("startTime") LocalTime startTime,
                                            @Param("endTime") LocalTime endTime);
}