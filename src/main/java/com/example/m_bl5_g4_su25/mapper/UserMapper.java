package com.example.m_bl5_g4_su25.mapper;

import com.example.m_bl5_g4_su25.dto.request.UserCreationRequest;
import com.example.m_bl5_g4_su25.dto.response.UserResponse;
import com.example.m_bl5_g4_su25.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User toUser(UserCreationRequest request);

    UserResponse toUserResponse(User user);
}