package com.example.m_bl5_g4_su25.service;

import com.example.m_bl5_g4_su25.dto.request.AddInstructorRequest;
import com.example.m_bl5_g4_su25.dto.request.EditUserRequest;
import com.example.m_bl5_g4_su25.dto.request.UserCreationRequest;
import com.example.m_bl5_g4_su25.dto.response.ListUserResponse;
import com.example.m_bl5_g4_su25.dto.response.UserResponse;
import org.springframework.data.domain.Page;

import java.util.List;


public interface IUserService {
    List<ListUserResponse> getAllUsers();
    ListUserResponse editUser(Long id, EditUserRequest request);
    void addInstructor(AddInstructorRequest request);
    Page<ListUserResponse> getAllUsersPagination(String keyword, int page, int size);
    ListUserResponse getUserById(Long id);
    UserResponse register(UserCreationRequest request);

}

