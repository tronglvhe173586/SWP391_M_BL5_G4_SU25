/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.example.m_bl5_g4_su25.service;

import com.example.m_bl5_g4_su25.dto.request.AddClassRequest;
import com.example.m_bl5_g4_su25.dto.request.EditClassRequest;
import com.example.m_bl5_g4_su25.dto.response.ClassResponse;
import com.example.m_bl5_g4_su25.entity.Class;
import com.example.m_bl5_g4_su25.entity.Course;
import com.example.m_bl5_g4_su25.entity.User;
import com.example.m_bl5_g4_su25.repository.ClassRepository;
import com.example.m_bl5_g4_su25.repository.CourseRepository;
import com.example.m_bl5_g4_su25.repository.UserRepository;
import java.time.LocalDate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClassService implements IClassService {

    @Autowired
    private ClassRepository classRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public List<ClassResponse> listClasses(Long instructorId) {
        List<Class> classes = instructorId != null 
            ? classRepository.findByInstructorUserId(instructorId) 
            : classRepository.findAll();
        return classes.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public ClassResponse addClass(AddClassRequest request) {
        validateDates(request.getStartDate(), request.getEndDate());
        validateMaxStudents(request.getMaxStudents());

        Class newClass = new Class();
        Course course = courseRepository.findById(request.getCourseId())
            .orElseThrow(() -> new RuntimeException("Course not found"));
        User instructor = userRepository.findById(request.getInstructorId())
            .orElseThrow(() -> new RuntimeException("Instructor not found"));

        newClass.setCourse(course);
        newClass.setClassName(request.getClassName());
        newClass.setStartDate(request.getStartDate());
        newClass.setEndDate(request.getEndDate());
        newClass.setMaxStudents(request.getMaxStudents());
        newClass.setInstructor(instructor);

        Class saved = classRepository.save(newClass);
        return mapToResponse(saved);
    }

    @Override
    public ClassResponse getClassById(Long id) {
        Class clazz = classRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Class not found"));
        return mapToResponse(clazz);
    }

    @Override
    public ClassResponse editClass(Long id, EditClassRequest request) {
        Class clazz = classRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Class not found"));

        if (request.getCourseId() != null) {
            Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new RuntimeException("Course not found"));
            clazz.setCourse(course);
        }
        if (request.getClassName() != null) {
            clazz.setClassName(request.getClassName());
        }
        if (request.getStartDate() != null && request.getEndDate() != null) {
            validateDates(request.getStartDate(), request.getEndDate());
            clazz.setStartDate(request.getStartDate());
            clazz.setEndDate(request.getEndDate());
        } else if (request.getStartDate() != null) {
            validateDates(request.getStartDate(), clazz.getEndDate());
            clazz.setStartDate(request.getStartDate());
        } else if (request.getEndDate() != null) {
            validateDates(clazz.getStartDate(), request.getEndDate());
            clazz.setEndDate(request.getEndDate());
        }
        if (request.getMaxStudents() != null) {
            validateMaxStudents(request.getMaxStudents());
            clazz.setMaxStudents(request.getMaxStudents());
        }
        if (request.getInstructorId() != null) {
            User instructor = userRepository.findById(request.getInstructorId())
                .orElseThrow(() -> new RuntimeException("Instructor not found"));
            clazz.setInstructor(instructor);
        }

        Class updated = classRepository.save(clazz);
        return mapToResponse(updated);
    }

    private void validateDates(LocalDate startDate, LocalDate endDate) {
        if (startDate.isAfter(endDate)) {
            throw new RuntimeException("Start date must be before end date");
        }
    }

    private void validateMaxStudents(Integer maxStudents) {
        if (maxStudents <= 0) {
            throw new RuntimeException("Max students must be greater than 0");
        }
    }

    private ClassResponse mapToResponse(Class clazz) {
        ClassResponse response = new ClassResponse();
        response.setClassId(clazz.getClassId());
        response.setCourseId(clazz.getCourse().getCourseId());
        response.setClassName(clazz.getClassName());
        response.setStartDate(clazz.getStartDate());
        response.setEndDate(clazz.getEndDate());
        response.setMaxStudents(clazz.getMaxStudents());
        response.setInstructorId(clazz.getInstructor() != null ? clazz.getInstructor().getUserId() : null);
        response.setInstructorName(clazz.getInstructor() != null ? clazz.getInstructor().getFullName() : null);
        response.setCurrentStudentsCount(clazz.getCurrentStudentsCount());
        return response;
    }
}
