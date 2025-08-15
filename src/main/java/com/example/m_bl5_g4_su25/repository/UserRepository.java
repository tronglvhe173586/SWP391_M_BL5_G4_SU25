package com.example.m_bl5_g4_su25.repository;

import com.example.m_bl5_g4_su25.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    @Query("SELECT DISTINCT u FROM User u " +
           "JOIN u.enrollments e " +
           "JOIN e.classField c " +
           "WHERE c.instructor.id = :instructorId " +
           "AND u.role = 'LEARNER' " +
           "AND e.status = 'ENROLLED'")
    List<User> findLearnersByInstructorId(@Param("instructorId") Long instructorId);
}
