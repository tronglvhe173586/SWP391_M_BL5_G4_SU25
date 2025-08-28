package com.example.m_bl5_g4_su25.repository;

import com.example.m_bl5_g4_su25.entity.ExamResult;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExamResultRepository extends JpaRepository<ExamResult, Long> {
    List<ExamResult> findByLearnerIdAndExamScheduleId(Long learnerId, Long examScheduleId);

    List<ExamResult> findByExamScheduleId(Long examScheduleId);

    List<ExamResult> findByLearnerId(Long learnerId);

    @Query("SELECT er FROM ExamResult er " +
            "JOIN er.learner l " +
            "JOIN er.examSchedule es " +
            "JOIN es.exam e " +
            "JOIN es.classField c " +
            "JOIN es.instructor i " +
            "WHERE (l.firstName LIKE %:keyword% OR l.lastName LIKE %:keyword% OR " +
            "l.email LIKE %:keyword% OR e.examName LIKE %:keyword% OR " +
            "c.className LIKE %:keyword% OR es.location LIKE %:keyword% OR " +
            "i.firstName LIKE %:keyword% OR i.lastName LIKE %:keyword%)")
    Page<ExamResult> findByKeyword(@Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT er FROM ExamResult er " +
            "JOIN er.learner l " +
            "JOIN er.examSchedule es " +
            "JOIN es.exam e " +
            "JOIN es.classField c " +
            "JOIN es.instructor i " +
            "WHERE es.id = :examScheduleId AND " +
            "(l.firstName LIKE %:keyword% OR l.lastName LIKE %:keyword% OR " +
            "l.email LIKE %:keyword% OR e.examName LIKE %:keyword% OR " +
            "c.className LIKE %:keyword% OR es.location LIKE %:keyword% OR " +
            "i.firstName LIKE %:keyword% OR i.lastName LIKE %:keyword%)")
    Page<ExamResult> findByExamScheduleIdAndKeyword(@Param("examScheduleId") Long examScheduleId,
            @Param("keyword") String keyword, Pageable pageable);
}
