package com.example.m_bl5_g4_su25.service;

import com.example.m_bl5_g4_su25.dto.request.AddInstructorRequest;
import com.example.m_bl5_g4_su25.dto.request.EditUserRequest;
import com.example.m_bl5_g4_su25.dto.request.UserCreationRequest;
import com.example.m_bl5_g4_su25.dto.response.LearnerProfileResponse;
import com.example.m_bl5_g4_su25.dto.response.ListUserResponse;
import com.example.m_bl5_g4_su25.dto.response.UserResponse;
import com.example.m_bl5_g4_su25.entity.LearnerProfile;
import org.springframework.data.domain.Page;

import java.util.List;

public interface IUserService {
    List<ListUserResponse> getAllUsers();

    List<ListUserResponse> getLearners();

    ListUserResponse editUser(Long id, EditUserRequest request);
    List<ListUserResponse> getUsersByRole(String role);
    void addInstructor(AddInstructorRequest request);
    void addStaff(AddInstructorRequest request);
    Page<ListUserResponse> getAllUsersPagination(String keyword, int page, int size);

    ListUserResponse getUserById(Long id);

    UserResponse register(UserCreationRequest request);

    Object getProfileById(Long id);
}
