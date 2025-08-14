package com.example.m_bl5_g4_su25.service;

import com.example.m_bl5_g4_su25.dto.request.AddInstructorRequest;
import com.example.m_bl5_g4_su25.dto.request.EditUserRequest;
import com.example.m_bl5_g4_su25.dto.response.ListUserResponse;
import com.example.m_bl5_g4_su25.entity.InstructorProfile;
import com.example.m_bl5_g4_su25.entity.User;
import com.example.m_bl5_g4_su25.repository.InstructorProfileRepository;
import com.example.m_bl5_g4_su25.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService implements IUserService{

    private final UserRepository userRepository;
    private final InstructorProfileRepository instructorProfileRepository;

    public UserService(UserRepository userRepository, InstructorProfileRepository instructorProfileRepository) {
        this.userRepository = userRepository;
        this.instructorProfileRepository = instructorProfileRepository;
    }

    @Override
    public List<ListUserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(user -> new ListUserResponse(
                        user.getId(),
                        user.getUsername(),
                        user.getFullName(),
                        user.getEmail(),
                        user.getRole(),
                        user.getIsActive()
                ))
                .collect(Collectors.toList());
    }

    @Override
    public ListUserResponse editUser(Long id, EditUserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + id));

        user.setUsername(request.getUsername());
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setRole(request.getRole());
        user.setIsActive(request.getIsActive());

        User updated = userRepository.save(user);

        return new ListUserResponse(
                updated.getId(),
                updated.getUsername(),
                updated.getFullName(),
                updated.getEmail(),
                updated.getRole(),
                updated.getIsActive()
        );
    }

    @Override
    public void addInstructor(AddInstructorRequest request) {
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPasswordHash(request.getPasswordHash());
        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());
        user.setRole("INSTRUCTOR");
        user.setIsActive(request.getIsActive());
        userRepository.save(user);

        InstructorProfile profile = new InstructorProfile();
        profile.setUser(user);
        profile.setEmployeeId(request.getEmployeeId());
        profile.setHireDate(request.getHireDate());
        profile.setCertificationInfo(request.getCertificationInfo());
        instructorProfileRepository.save(profile);
    }
}
