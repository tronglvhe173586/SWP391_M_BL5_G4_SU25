package com.example.m_bl5_g4_su25.service;

import com.example.m_bl5_g4_su25.dto.request.AddClassRequest;
import com.example.m_bl5_g4_su25.dto.request.EditClassRequest;
import com.example.m_bl5_g4_su25.dto.response.ClassResponse;
import com.example.m_bl5_g4_su25.entity.Class;
import com.example.m_bl5_g4_su25.entity.Course;
import com.example.m_bl5_g4_su25.entity.User;
import com.example.m_bl5_g4_su25.exception.ClassNotFoundException;
import com.example.m_bl5_g4_su25.exception.ClassValidationException;
import com.example.m_bl5_g4_su25.repository.ClassRepository;
import com.example.m_bl5_g4_su25.repository.CourseRepository;
import com.example.m_bl5_g4_su25.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ClassService implements IClassService {

    private static final Logger logger = LoggerFactory.getLogger(ClassService.class);

    @Autowired
    private ClassRepository classRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public List<ClassResponse> getAllClasses() {
        logger.debug("Fetching all active classes");
        List<Class> classes = classRepository.findAll().stream()
                .filter(c -> !Boolean.TRUE.equals(c.getIsDeleted()))
                .collect(Collectors.toList());
        return classes.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ClassResponse getClassById(Long classId) {
        logger.debug("Fetching class with ID: {}", classId);
        Optional<Class> classOptional = classRepository.findById(classId);
        if (classOptional.isPresent()) {
            return convertToResponse(classOptional.get());
        } else {
            throw new ClassNotFoundException(classId);
        }
    }

    @Override
    public ClassResponse createClass(AddClassRequest request) {
        logger.debug("Creating new class with request: {}", request);
        validateClassRequest(request);

        Class newClass = new Class();
        newClass.setClassName(request.getClassName());
        newClass.setStartDate(request.getStartDate());
        newClass.setEndDate(request.getEndDate());
        newClass.setMaxStudents(request.getMaxStudents());
        newClass.setCourse(courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new ClassValidationException("Khóa học không tìm thấy với ID: " + request.getCourseId())));
        newClass.setInstructor(userRepository.findById(request.getInstructorId())
                .orElseThrow(() -> new ClassValidationException("Giảng viên không tìm thấy với ID: " + request.getInstructorId())));
        newClass.setIsDeleted(false);
        newClass.setCurrentStudentsCount(0);

        Class savedClass = classRepository.save(newClass);
        logger.debug("Class created with ID: {}", savedClass.getId());
        return convertToResponse(savedClass);
    }

    @Override
    public ClassResponse updateClass(Long classId, EditClassRequest request) {
        logger.debug("Updating class with ID: {} and request: {}", classId, request);
        Optional<Class> classOptional = classRepository.findById(classId);

        if (classOptional.isPresent()) {
            Class existingClass = classOptional.get();
            if (request.getClassName() != null) existingClass.setClassName(request.getClassName());
            if (request.getStartDate() != null) existingClass.setStartDate(request.getStartDate());
            if (request.getEndDate() != null) existingClass.setEndDate(request.getEndDate());
            if (request.getMaxStudents() != null) existingClass.setMaxStudents(request.getMaxStudents());
            if (request.getCourseId() != null) {
                existingClass.setCourse(courseRepository.findById(request.getCourseId())
                        .orElseThrow(() -> new ClassValidationException("Khóa học không tìm thấy với ID: " + request.getCourseId())));
            }
            if (request.getInstructorId() != null) {
                existingClass.setInstructor(userRepository.findById(request.getInstructorId())
                        .orElseThrow(() -> new ClassValidationException("Giảng viên không tìm thấy với ID: " + request.getInstructorId())));
            }
            validateDates(existingClass.getStartDate(), existingClass.getEndDate());

            Class updatedClass = classRepository.save(existingClass);
            logger.debug("Class updated with ID: {}", updatedClass.getId());
            return convertToResponse(updatedClass);
        } else {
            throw new ClassNotFoundException(classId);
        }
    }

    private ClassResponse convertToResponse(Class clazz) {
        return new ClassResponse(
                clazz.getId(),
                clazz.getClassName(),
                clazz.getStartDate(),
                clazz.getEndDate(),
                clazz.getMaxStudents(),
                clazz.getCourse() != null ? clazz.getCourse().getId() : null,
                clazz.getInstructor() != null ? clazz.getInstructor().getId() : null,
                clazz.getInstructor() != null ? clazz.getInstructor().getFirstName() + " " + clazz.getInstructor().getLastName() : null,
                clazz.getCurrentStudentsCount()
        );
    }

    private void validateClassRequest(AddClassRequest request) {
        if (request.getClassName() == null || request.getClassName().trim().isEmpty()) {
            throw new ClassValidationException("Tên lớp không được để trống");
        }
        validateDates(request.getStartDate(), request.getEndDate());
        if (request.getMaxStudents() == null || request.getMaxStudents() <= 0) {
            throw new ClassValidationException("Sĩ số tối đa phải lớn hơn 0");
        }
    }

    private void validateDates(LocalDate startDate, LocalDate endDate) {
        if (startDate.isAfter(endDate)) {
            throw new ClassValidationException("Ngày bắt đầu phải trước ngày kết thúc");
        }
    }
}