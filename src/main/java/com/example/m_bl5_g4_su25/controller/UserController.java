package com.example.m_bl5_g4_su25.controller;

import com.example.m_bl5_g4_su25.dto.request.AddInstructorRequest;
import com.example.m_bl5_g4_su25.dto.request.EditUserRequest;
import com.example.m_bl5_g4_su25.dto.request.UserCreationRequest;
import com.example.m_bl5_g4_su25.dto.response.LearnerProfileResponse;
import com.example.m_bl5_g4_su25.dto.response.ListUserResponse;
import com.example.m_bl5_g4_su25.dto.response.UserResponse;
import com.example.m_bl5_g4_su25.service.IUserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final IUserService userService;

    @GetMapping
    public ResponseEntity<List<ListUserResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/learners")
    //@PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<ListUserResponse>> getLearners() {
        return ResponseEntity.ok(userService.getLearners());
    }

    @PutMapping("/edit_User/{id}")
    public ResponseEntity<ListUserResponse> editUser(
            @PathVariable Long id,
            @Valid @RequestBody EditUserRequest request) {
        return ResponseEntity.ok(userService.editUser(id, request));
    }

    @PostMapping("/Add_Instructor")
    public ResponseEntity<String> addInstructor(@RequestBody AddInstructorRequest request) {
        userService.addInstructor(request);
        return ResponseEntity.ok("Instructor created successfully");
    }
    @PostMapping("/add_staff")
    public ResponseEntity<String> addStaff(@RequestBody AddInstructorRequest request) {
        userService.addStaff(request);
        return ResponseEntity.ok("Staff created successfully");
    }

    @GetMapping("/users_pagination")
    public Page<ListUserResponse> getAllUsers(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return userService.getAllUsersPagination(keyword, page, size);
    }

    @GetMapping("/{id}")
    public ListUserResponse getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@RequestBody UserCreationRequest request) {
        UserResponse response = userService.register(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/profile")
    public ResponseEntity<?> getUserProfile(@PathVariable Long id) {
        Object response = userService.getProfileById(id);
        return ResponseEntity.ok(response);
    }
}
