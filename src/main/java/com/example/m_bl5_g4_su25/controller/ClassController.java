/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.example.m_bl5_g4_su25.controller;

import com.example.m_bl5_g4_su25.dto.request.AddClassRequest;
import com.example.m_bl5_g4_su25.dto.request.EditClassRequest;
import com.example.m_bl5_g4_su25.dto.response.ClassResponse;
import com.example.m_bl5_g4_su25.service.IClassService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/classes")
public class ClassController {

    @Autowired
    private IClassService classService;

    @GetMapping
    public List<ClassResponse> listClasses(@RequestParam(required = false) Long instructorId) {
        return classService.listClasses(instructorId);
    }

    @PostMapping
    public ClassResponse addClass(@Valid @RequestBody AddClassRequest request) {
        return classService.addClass(request);
    }

    @GetMapping("/{id}")
    public ClassResponse viewClass(@PathVariable Long id) {
        return classService.getClassById(id);
    }

    @PutMapping("/{id}")
    public ClassResponse editClass(@PathVariable Long id, @Valid @RequestBody EditClassRequest request) {
        return classService.editClass(id, request);
    }
}