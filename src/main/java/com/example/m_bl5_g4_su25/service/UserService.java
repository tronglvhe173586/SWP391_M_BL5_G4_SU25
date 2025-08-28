package com.example.m_bl5_g4_su25.service;

import com.example.m_bl5_g4_su25.dto.request.AddInstructorRequest;
import com.example.m_bl5_g4_su25.dto.request.EditUserRequest;
import com.example.m_bl5_g4_su25.dto.request.UserCreationRequest;
import com.example.m_bl5_g4_su25.dto.response.InstructorProfileResponse;
import com.example.m_bl5_g4_su25.dto.response.LearnerProfileResponse;
import com.example.m_bl5_g4_su25.dto.response.ListUserResponse;
import com.example.m_bl5_g4_su25.dto.response.UserResponse;
import com.example.m_bl5_g4_su25.entity.InstructorProfile;
import com.example.m_bl5_g4_su25.entity.LearnerProfile;
import com.example.m_bl5_g4_su25.entity.Provinces;
import com.example.m_bl5_g4_su25.entity.User;
import com.example.m_bl5_g4_su25.enums.Gender;
import com.example.m_bl5_g4_su25.enums.Role;
import com.example.m_bl5_g4_su25.repository.InstructorProfileRepository;
import com.example.m_bl5_g4_su25.repository.ProvinceRepository;
import com.example.m_bl5_g4_su25.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService implements IUserService {

    private final UserRepository userRepository;
    private final InstructorProfileRepository instructorProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final ProvinceRepository provinceRepository;

    public UserService(UserRepository userRepository, InstructorProfileRepository instructorProfileRepository,
                       PasswordEncoder passwordEncoder, ProvinceRepository provinceRepository) {
        this.userRepository = userRepository;
        this.instructorProfileRepository = instructorProfileRepository;
        this.passwordEncoder = passwordEncoder;
        this.provinceRepository = provinceRepository;
    }

    @Override
    public List<ListUserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(user -> new ListUserResponse(
                        user.getId(),
                        user.getUsername(),
                        user.getFirstName(),
                        user.getLastName(),
                        user.getEmail(),
                        user.getRole().name(),
                        user.getIsActive(),
                        user.getGender(),
                        user.getDateOfBirth()))
                .collect(Collectors.toList());
    }

    @Override
    public List<ListUserResponse> getLearners() {
        return userRepository.findByRole(Role.LEARNER).stream()
                .map(user -> new ListUserResponse(
                        user.getId(),
                        user.getUsername(),
                        user.getFirstName(),
                        user.getLastName(),
                        user.getEmail(),
                        user.getRole().name(),
                        user.getIsActive(),
                        user.getGender(),
                        user.getDateOfBirth()))
                .collect(Collectors.toList());
    }

    @Override
    public List<ListUserResponse> getUsersByRole(String role) {
        try {
            Role userRole = Role.valueOf(role.toUpperCase());
            return userRepository.findByRole(userRole).stream()
                    .map(user -> new ListUserResponse(
                            user.getId(),
                            user.getUsername(),
                            user.getFirstName(),
                            user.getLastName(),
                            user.getEmail(),
                            user.getRole().name(),
                            user.getIsActive(),
                            user.getGender(),
                            user.getDateOfBirth()))
                    .collect(Collectors.toList());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid role: " + role);
        }
    }

    @Override
    public ListUserResponse editUser(Long id, EditUserRequest request) {
        // Implementation as provided in original code
        throw new UnsupportedOperationException("Not implemented in this snippet");
    }

    @Override
    public void addInstructor(AddInstructorRequest request) {
        // Implementation as provided in original code
        throw new UnsupportedOperationException("Not implemented in this snippet");
    }

    @Override
    public void addStaff(AddInstructorRequest request) {
        // Implementation as provided in original code
        throw new UnsupportedOperationException("Not implemented in this snippet");
    }

    @Override
    public Page<ListUserResponse> getAllUsersPagination(String keyword, int page, int size) {
        // Implementation as provided in original code
        throw new UnsupportedOperationException("Not implemented in this snippet");
    }

    @Override
    public ListUserResponse getUserById(Long id) {
        // Implementation as provided in original code
        throw new UnsupportedOperationException("Not implemented in this snippet");
    }

    @Override
    public UserResponse register(UserCreationRequest request) {
        // Implementation as provided in original code
        throw new UnsupportedOperationException("Not implemented in this snippet");
    }

    @Override
    public Object getProfileById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + id));
        Provinces province = user.getProvince();
        if ("INSTRUCTOR".equalsIgnoreCase(String.valueOf(user.getRole()))) {
            InstructorProfile instructorProfile = user.getInstructorProfile();
            return new InstructorProfileResponse(
                    user.getUsername(),
                    user.getEmail(),
                    user.getFirstName(),
                    user.getLastName(),
                    user.getGender(),
                    user.getDateOfBirth(),
                    province != null ? province.getName() : null,
                    instructorProfile != null ? instructorProfile.getEmployeeId() : null,
                    instructorProfile != null ? instructorProfile.getHireDate() : null,
                    instructorProfile != null ? instructorProfile.getAddress() : null,
                    instructorProfile != null ? instructorProfile.getPhoneNumber() : null,
                    instructorProfile != null ? instructorProfile.getCertificationInfo() : null);
        } else if ("LEARNER".equalsIgnoreCase(String.valueOf(user.getRole()))) {
            LearnerProfile learnerProfile = user.getLearnerProfile();
            return new LearnerProfileResponse(
                    user.getUsername(),
                    user.getEmail(),
                    user.getFirstName(),
                    user.getLastName(),
                    user.getGender(),
                    user.getDateOfBirth(),
                    province != null ? province.getName() : null,
                    learnerProfile != null ? learnerProfile.getAddress() : null,
                    learnerProfile != null ? learnerProfile.getPhoneNumber() : null);
        }
        throw new IllegalArgumentException("Unsupported role: " + user.getRole());
    }

    private String generateEmployeeId() {
        long count = instructorProfileRepository.count() + 1;
        String year = String.valueOf(LocalDate.now().getYear());
        return "EMP" + year + String.format("%04d", count);
    }
}