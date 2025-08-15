package com.example.m_bl5_g4_su25.repository;

import com.example.m_bl5_g4_su25.entity.ExamResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExamResultRepository extends JpaRepository<ExamResult, Long> {
    
    @Query("SELECT er FROM ExamResult er " +
           "JOIN FETCH er.learner u " +
           "JOIN FETCH er.examSchedule es " +
           "JOIN FETCH es.exam e " +
           "WHERE u.role = 'LEARNER' " +
           "AND u.id = :learnerId " +
           "ORDER BY er.resultDate DESC")
    List<ExamResult> findExamResultsByLearnerId(@Param("learnerId") Long learnerId);
}
