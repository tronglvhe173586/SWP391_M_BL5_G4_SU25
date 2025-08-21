package com.example.m_bl5_g4_su25.service;

import com.example.m_bl5_g4_su25.dto.request.AddClassRequest;
import com.example.m_bl5_g4_su25.dto.request.EditClassRequest;
import com.example.m_bl5_g4_su25.dto.response.ClassResponse;
import com.example.m_bl5_g4_su25.entity.DrivingClass;
import com.example.m_bl5_g4_su25.entity.Course;
import com.example.m_bl5_g4_su25.entity.User;
import com.example.m_bl5_g4_su25.repository.ClassRepository;
import com.example.m_bl5_g4_su25.repository.CourseRepository;
import com.example.m_bl5_g4_su25.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
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
    public List<ClassResponse> getAllClasses() {
        List<DrivingClass> classes = classRepository.findAll();
        return classes.stream()
                .filter(clazz -> !Boolean.TRUE.equals(clazz.getIsDeleted()))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ClassResponse getClassById(Long classId) {
        DrivingClass clazz = classRepository.findById(classId)
                .orElseThrow(() -> new RuntimeException("Class not found with ID: " + classId));
        return mapToResponse(clazz);
    }

    @Override
    public ClassResponse createClass(AddClassRequest request) {
        validateRequest(request, true);

        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new RuntimeException("Course not found with ID: " + request.getCourseId()));
        User instructor = userRepository.findById(request.getInstructorId())
                .orElseThrow(() -> new RuntimeException("Instructor not found with ID: " + request.getInstructorId()));

        DrivingClass newClass = new DrivingClass();
        newClass.setCourse(course);
        newClass.setClassName(request.getClassName());
        newClass.setStartDate(request.getStartDate());
        newClass.setEndDate(request.getEndDate());
        newClass.setMaxStudents(request.getMaxStudents());
        newClass.setInstructor(instructor);
        newClass.setCurrentStudentsCount(0);
        newClass.setIsDeleted(false);

        DrivingClass savedClass = classRepository.save(newClass);
        return mapToResponse(savedClass);
    }

    @Override
    public ClassResponse updateClass(Long classId, EditClassRequest request) {
        DrivingClass clazz = classRepository.findById(classId)
                .orElseThrow(() -> new RuntimeException("Class not found with ID: " + classId));

        validateRequest(request, false);

        if (request.getCourseId() != null) {
            Course course = courseRepository.findById(request.getCourseId())
                    .orElseThrow(() -> new RuntimeException("Course not found with ID: " + request.getCourseId()));
            clazz.setCourse(course);
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
            User instructor = userRepository.findById(request.getInstructorId())
                    .orElseThrow(() -> new RuntimeException("Instructor not found with ID: " + request.getInstructorId()));
            clazz.setInstructor(instructor);
        }

        DrivingClass updatedClass = classRepository.save(clazz);
        return mapToResponse(updatedClass);
    }

    private void validateRequest(Object request, boolean isCreate) {
        if (isCreate) {
            AddClassRequest req = (AddClassRequest) request;
            if (req.getClassName() == null || req.getClassName().trim().isEmpty()) {
                throw new RuntimeException("Class name cannot be empty");
            }
            if (req.getStartDate() == null || req.getEndDate() == null || req.getMaxStudents() == null || req.getCourseId() == null || req.getInstructorId() == null) {
                throw new RuntimeException("All fields are required for creation");
            }
        } else {
            EditClassRequest req = (EditClassRequest) request;
            if (req.getStartDate() != null && req.getEndDate() != null) {
                validateDates(req.getStartDate(), req.getEndDate());
            }
            if (req.getMaxStudents() != null) {
                validateMaxStudents(req.getMaxStudents());
            }
        }
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

    private ClassResponse mapToResponse(DrivingClass clazz) {
        ClassResponse response = new ClassResponse();
        response.setId(clazz.getId());
        response.setCourse(clazz.getCourse() != null ? clazz.getCourse().getId() : null);
        response.setClassName(clazz.getClassName());
        response.setStartDate(clazz.getStartDate());
        response.setEndDate(clazz.getEndDate());
        response.setMaxStudents(clazz.getMaxStudents());
        response.setInstructor(clazz.getInstructor() != null ? clazz.getInstructor().getId() : null);
        response.setInstructorName(clazz.getInstructor() != null ? clazz.getInstructor().getFirstName() + " " + clazz.getInstructor().getLastName() : null);
        response.setCurrentStudentsCount(clazz.getCurrentStudentsCount());
        return response;
    }
}