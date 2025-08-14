package com.example.m_bl5_g4_su25.controller;

import com.example.m_bl5_g4_su25.dto.request.AddInstructorRequest;
import com.example.m_bl5_g4_su25.dto.request.EditUserRequest;
import com.example.m_bl5_g4_su25.dto.response.ListUserResponse;
import com.example.m_bl5_g4_su25.service.IUserService;
import com.example.m_bl5_g4_su25.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final IUserService userService;


    // API lấy danh sách user
    @GetMapping
    public ResponseEntity<List<ListUserResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PutMapping("/editUser/{id}")
    public ResponseEntity<ListUserResponse> editUser(
            @PathVariable Long id,
            @Valid @RequestBody EditUserRequest request
    ) {
        return ResponseEntity.ok(userService.editUser(id, request));
    }
    @PostMapping("/AddInstructor")
    public ResponseEntity<String> addInstructor(@RequestBody AddInstructorRequest request) {
        userService.addInstructor(request);
        return ResponseEntity.ok("Instructor created successfully");
    }
}

