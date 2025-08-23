package com.example.m_bl5_g4_su25.controller;

import com.example.m_bl5_g4_su25.dto.request.AddClassRequest;
import com.example.m_bl5_g4_su25.dto.request.EditClassRequest;
import com.example.m_bl5_g4_su25.dto.response.ClassResponse;
import com.example.m_bl5_g4_su25.service.IClassService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/classes")
public class ClassController {

    @Autowired
    private IClassService classService;

    @GetMapping
    public ResponseEntity<List<ClassResponse>> getAllClasses() {
        List<ClassResponse> classes = classService.getAllClasses();
        return ResponseEntity.ok(classes);
    }

    @GetMapping("/{classId}")
    public ResponseEntity<ClassResponse> getClassById(@PathVariable Long classId) {
        ClassResponse classResponse = classService.getClassById(classId);
        return ResponseEntity.ok(classResponse);
    }

    @PostMapping
    public ResponseEntity<ClassResponse> createClass(@Valid @RequestBody AddClassRequest addClassRequest) {
        ClassResponse createdClass = classService.createClass(addClassRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdClass);
    }

    @PutMapping("/{classId}")
    public ResponseEntity<ClassResponse> updateClass(
            @PathVariable Long classId,
            @Valid @RequestBody EditClassRequest editClassRequest) {
        ClassResponse updatedClass = classService.updateClass(classId, editClassRequest);
        return ResponseEntity.ok(updatedClass);
    }
}