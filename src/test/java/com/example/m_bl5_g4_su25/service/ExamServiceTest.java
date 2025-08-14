package com.example.m_bl5_g4_su25.service;

import com.example.m_bl5_g4_su25.dto.response.ExamResponse;
import com.example.m_bl5_g4_su25.entity.Exam;
import com.example.m_bl5_g4_su25.enums.ExamType;
import com.example.m_bl5_g4_su25.exception.ExamNotFoundException;
import com.example.m_bl5_g4_su25.exception.ExamValidationException;
import com.example.m_bl5_g4_su25.repository.ExamRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ExamServiceTest {

    @Mock
    private ExamRepository examRepository;

    @InjectMocks
    private ExamService examService;

    private Exam exam;
    private Exam updatedExam;

    @BeforeEach
    void setUp() {
        exam = new Exam();
        exam.setId(1L);
        exam.setExamName("Original Exam");
        exam.setExamType(ExamType.THEORY);
        exam.setPassScore(70);

        updatedExam = new Exam();
        updatedExam.setId(1L);
        updatedExam.setExamName("Updated Exam");
        updatedExam.setExamType(ExamType.PRACTICAL);
        updatedExam.setPassScore(80);
    }

    @Test
    void updateExam_Success() {
        // Given
        when(examRepository.findById(1L)).thenReturn(Optional.of(exam));
        when(examRepository.save(any(Exam.class))).thenReturn(updatedExam);

        // When
        ExamResponse result = examService.updateExam(1L, updatedExam);

        // Then
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Updated Exam", result.getExamName());
        assertEquals(ExamType.PRACTICAL, result.getExamType());
        assertEquals(80, result.getPassScore());

        verify(examRepository).findById(1L);
        verify(examRepository).save(any(Exam.class));
    }

    @Test
    void updateExam_NotFound() {
        // Given
        when(examRepository.findById(999L)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(ExamNotFoundException.class, () -> {
            examService.updateExam(999L, updatedExam);
        });

        verify(examRepository).findById(999L);
        verify(examRepository, never()).save(any(Exam.class));
    }

    @Test
    void getExamById_Success() {
        // Given
        when(examRepository.findById(1L)).thenReturn(Optional.of(exam));

        // When
        ExamResponse result = examService.getExamById(1L);

        // Then
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Original Exam", result.getExamName());
        assertEquals(ExamType.THEORY, result.getExamType());
        assertEquals(70, result.getPassScore());

        verify(examRepository).findById(1L);
    }

    @Test
    void getExamById_NotFound() {
        // Given
        when(examRepository.findById(999L)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(ExamNotFoundException.class, () -> {
            examService.getExamById(999L);
        });

        verify(examRepository).findById(999L);
    }

    @Test
    void createExam_Success() {
        // Given
        Exam newExam = new Exam();
        newExam.setExamName("New Exam");
        newExam.setExamType(ExamType.SIMULATION);
        newExam.setPassScore(75);

        Exam savedExam = new Exam();
        savedExam.setId(2L);
        savedExam.setExamName("New Exam");
        savedExam.setExamType(ExamType.SIMULATION);
        savedExam.setPassScore(75);

        when(examRepository.existsByExamName("New Exam")).thenReturn(false);
        when(examRepository.save(any(Exam.class))).thenReturn(savedExam);

        // When
        ExamResponse result = examService.createExam(newExam);

        // Then
        assertNotNull(result);
        assertEquals(2L, result.getId());
        assertEquals("New Exam", result.getExamName());
        assertEquals(ExamType.SIMULATION, result.getExamType());
        assertEquals(75, result.getPassScore());

        verify(examRepository).existsByExamName("New Exam");
        verify(examRepository).save(any(Exam.class));
    }

    @Test
    void createExam_DuplicateName() {
        // Given
        Exam newExam = new Exam();
        newExam.setExamName("Existing Exam");
        newExam.setExamType(ExamType.THEORY);
        newExam.setPassScore(70);

        when(examRepository.existsByExamName("Existing Exam")).thenReturn(true);

        // When & Then
        assertThrows(ExamValidationException.class, () -> {
            examService.createExam(newExam);
        });

        verify(examRepository).existsByExamName("Existing Exam");
        verify(examRepository, never()).save(any(Exam.class));
    }

    @Test
    void createExam_EmptyName() {
        // Given
        Exam newExam = new Exam();
        newExam.setExamName("");
        newExam.setExamType(ExamType.THEORY);
        newExam.setPassScore(70);

        // When & Then
        assertThrows(ExamValidationException.class, () -> {
            examService.createExam(newExam);
        });

        verify(examRepository, never()).existsByExamName(anyString());
        verify(examRepository, never()).save(any(Exam.class));
    }

    @Test
    void createExam_NullName() {
        // Given
        Exam newExam = new Exam();
        newExam.setExamName(null);
        newExam.setExamType(ExamType.THEORY);
        newExam.setPassScore(70);

        // When & Then
        assertThrows(ExamValidationException.class, () -> {
            examService.createExam(newExam);
        });

        verify(examRepository, never()).existsByExamName(anyString());
        verify(examRepository, never()).save(any(Exam.class));
    }
}
