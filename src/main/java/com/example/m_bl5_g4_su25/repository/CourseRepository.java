/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/DrivingClass.java to edit this template
 */
package com.example.m_bl5_g4_su25.repository;

import com.example.m_bl5_g4_su25.entity.Course;
import com.example.m_bl5_g4_su25.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    Page<Course> findByCourseNameContainingIgnoreCase(
            String courseName, Pageable pageable);

}