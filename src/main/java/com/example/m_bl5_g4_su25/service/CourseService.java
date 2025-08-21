package com.example.m_bl5_g4_su25.service;

import com.example.m_bl5_g4_su25.dto.request.AddCourseRequest;
import com.example.m_bl5_g4_su25.dto.request.EditCourseRequest;
import com.example.m_bl5_g4_su25.dto.response.ClassResponse;
import com.example.m_bl5_g4_su25.dto.response.ListCourseResponse;
import com.example.m_bl5_g4_su25.dto.response.ListUserResponse;
import com.example.m_bl5_g4_su25.entity.Course;
import com.example.m_bl5_g4_su25.entity.User;
import com.example.m_bl5_g4_su25.repository.ClassRepository;
import com.example.m_bl5_g4_su25.repository.CourseRepository;
import com.example.m_bl5_g4_su25.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;


@Service
public class CourseService implements ICourseService {

    private final CourseRepository courseRepository;
    private final ClassRepository classRepository;

    public CourseService(CourseRepository courseRepository, ClassRepository classRepository) {
        this.courseRepository = courseRepository;
        this.classRepository = classRepository;
    }


    @Override
    public Page<ListCourseResponse> getAllCoursesPagination(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);

        Page<Course> coursePage;
        if (keyword != null && !keyword.trim().isEmpty()) {
            coursePage = courseRepository.findByCourseNameContainingIgnoreCase(keyword, pageable);
        } else {
            coursePage = courseRepository.findAll(pageable);
        }

        return coursePage.map(course -> new ListCourseResponse(
                course.getId(),
                course.getCourseName(),
                course.getCourseType(),
                course.getDescription(),
                course.getPrice(),
                course.getDuration(),
                course.getIsDeleted()
        ));
    }

    @Override
        public ListCourseResponse editCourse(Long id, EditCourseRequest request) {
            Course course = courseRepository.findById(id).
                    orElseThrow(() -> new EntityNotFoundException("Course not found with id: " + id));
            course.setCourseName(request.getCourseName());
            course.setCourseType(request.getCourseType());
            course.setDescription(request.getDescription());
            course.setPrice(request.getPrice());
            course.setDuration(request.getDuration());
            course.setIsDeleted(request.getIsDeleted());
            Course updatedCourse = courseRepository.save(course);
            return new ListCourseResponse(
                    updatedCourse.getId(),
                    updatedCourse.getCourseName(),
                    updatedCourse.getCourseType(),
                    updatedCourse.getDescription(),
                    updatedCourse.getPrice(),
                    updatedCourse.getDuration(),
                    updatedCourse.getIsDeleted()
            );
        }

    @Override
    public ListCourseResponse addCourse(AddCourseRequest request) {
        Course course = new Course();
        course.setCourseName(request.getCourseName());
        course.setCourseType(request.getCourseType());
        course.setDescription(request.getDescription());
        course.setPrice(request.getPrice());
        course.setDuration(request.getDuration());
        course.setIsDeleted(false);
        Course newCourse = courseRepository.save(course);
        return new ListCourseResponse(
                newCourse.getId(),
                newCourse.getCourseName(),
                newCourse.getCourseType(),
                newCourse.getDescription(),
                newCourse.getPrice(),
                newCourse.getDuration(),
                newCourse.getIsDeleted()
        );
    }

    @Override
    public ListCourseResponse getCourseById(Long id) {
        Course course = courseRepository.findById(id).
                orElseThrow(() -> new EntityNotFoundException("Course not found with id: " + id));
        return new ListCourseResponse(
                course.getId(),
                course.getCourseName(),
                course.getCourseType(),
                course.getDescription(),
                course.getPrice(),
                course.getDuration(),
                course.getIsDeleted()
        );

    }

    @Override
    public List<ClassResponse> getClassesByCourse(Long courseId) {
        return classRepository.findByCourseId(courseId)
                .stream()
                .map(c -> new ClassResponse(
                        c.getId(),
                        c.getClassName(),
                        c.getStartDate(),
                        c.getEndDate(),
                        c.getMaxStudents(),
                        c.getCourse().getId(),
                        c.getInstructor().getId(),
                        c.getInstructor().getFirstName(),
                        c.getCurrentStudentsCount()
                ))
                .collect(Collectors.toList());
    }



}

