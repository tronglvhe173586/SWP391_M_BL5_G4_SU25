package com.example.m_bl5_g4_su25.controller;


import com.example.m_bl5_g4_su25.dto.request.AddCourseRequest;
import com.example.m_bl5_g4_su25.dto.request.EditCourseRequest;
import com.example.m_bl5_g4_su25.dto.response.ClassResponse;
import com.example.m_bl5_g4_su25.dto.response.ListCourseResponse;
import com.example.m_bl5_g4_su25.dto.response.ListUserResponse;
import com.example.m_bl5_g4_su25.service.ICourseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/courses")
@RequiredArgsConstructor
public class CourseController {

    private final ICourseService courseService;

    @GetMapping("/courses_pagination")
    public Page<ListCourseResponse> getAllCourses(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return courseService.getAllCoursesPagination(keyword, page, size);
    }
    @PutMapping("/edit_courses/{id}")
    public ResponseEntity<ListCourseResponse> editCourse(
            @PathVariable Long id,
            @Valid @RequestBody EditCourseRequest request
    ) {
        return ResponseEntity.ok(courseService.editCourse(id, request));
    }
    @PostMapping("/add_courses")
    public ResponseEntity<ListCourseResponse> addCourse(@RequestBody AddCourseRequest request) {
        return ResponseEntity.ok(courseService.addCourse(request));
    }
    @GetMapping("/{id}")
    public ListCourseResponse getCourseById(@PathVariable Long id) {
        return courseService.getCourseById(id);
    }
    @GetMapping("/by-course/{courseId}")
    public ResponseEntity<List<ClassResponse>> getClassesByCourse(@PathVariable Long courseId) {
        List<ClassResponse> classes = courseService.getClassesByCourse(courseId);
        return ResponseEntity.ok(classes);
    }

}
