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
        List<Class> classes = (instructorId != null) ? classRepository.findByInstructorId(instructorId) : classRepository.findByIsDeletedFalse();
        return classes.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public ClassResponse addClass(AddClassRequest request) {
        validateRequest(request);
        Class clazz = new Class();
        clazz.setCourse(courseRepository.findById(request.getCourseId()).orElseThrow(() -> new RuntimeException("Course not found")));
        clazz.setClassName(request.getClassName());
        clazz.setStartDate(request.getStartDate());
        clazz.setEndDate(request.getEndDate());
        clazz.setMaxStudents(request.getMaxStudents());
        clazz.setInstructor(userRepository.findById(request.getInstructorId()).orElseThrow(() -> new RuntimeException("Instructor not found")));
        clazz.setIsDeleted(false);
        Class saved = classRepository.save(clazz);
        return mapToResponse(saved);
    }

    @Override
    public ClassResponse getClassById(Long id) {
        Class clazz = classRepository.findById(id).orElseThrow(() -> new RuntimeException("Class not found"));
        return mapToResponse(clazz);
    }

    @Override
    public ClassResponse editClass(Long id, EditClassRequest request) {
        Class clazz = classRepository.findById(id).orElseThrow(() -> new RuntimeException("Class not found"));
        if (request.getCourseId() != null) {
            clazz.setCourse(courseRepository.findById(request.getCourseId()).orElseThrow(() -> new RuntimeException("Course not found")));
        }
        if (request.getClassName() != null) {
            clazz.setClassName(request.getClassName());
        }
        LocalDate startDate = request.getStartDate() != null ? request.getStartDate() : clazz.getStartDate();
        LocalDate endDate = request.getEndDate() != null ? request.getEndDate() : clazz.getEndDate();
        validateDates(startDate, endDate);
        clazz.setStartDate(startDate);
        clazz.setEndDate(endDate);
        if (request.getMaxStudents() != null) {
            validateMaxStudents(request.getMaxStudents());
            clazz.setMaxStudents(request.getMaxStudents());
        }
        if (request.getInstructorId() != null) {
            clazz.setInstructor(userRepository.findById(request.getInstructorId()).orElseThrow(() -> new RuntimeException("Instructor not found")));
        }
        Class updated = classRepository.save(clazz);
        return mapToResponse(updated);
    }

    private void validateRequest(AddClassRequest request) {
        validateDates(request.getStartDate(), request.getEndDate());
        validateMaxStudents(request.getMaxStudents());
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
        response.setClassId(clazz.getId());
        response.setCourseId(clazz.getCourse().getId());
        response.setClassName(clazz.getClassName());
        response.setStartDate(clazz.getStartDate());
        response.setEndDate(clazz.getEndDate());
        response.setMaxStudents(clazz.getMaxStudents());
        response.setInstructorId(clazz.getInstructor() != null ? clazz.getInstructor().getId() : null);
        response.setInstructorName(clazz.getInstructor() != null ? clazz.getInstructor().getFirstName() + " " + clazz.getInstructor().getLastName() : null);
        response.setCurrentStudentsCount(clazz.getCurrentStudentsCount());
        return response;
    }
}