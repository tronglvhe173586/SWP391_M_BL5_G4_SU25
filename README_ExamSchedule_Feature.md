# Exam Schedule Management Feature

## Overview

This feature allows administrators to add new exam schedules to the driving school management system. Admins can select classes, exams, and instructors from the database, as well as set exam dates and start times.

## Features

### 1. Add Exam Schedule

- **Class Selection**: Choose from available classes in the system (optional)
- **Exam Selection**: Select from available exams (required)
- **Instructor Assignment**: Assign an instructor to the exam schedule (optional)
- **Date & Time**: Set exam date and start time (required)
- **Location**: Specify exam location (optional)
- **Capacity**: Set maximum number of participants (optional)

### 2. View Exam Schedules

- Display all exam schedules in a table format
- Search and filter functionality
- Responsive design with Material-UI components

## UI Design & User Experience

### Interface Style

- **Full-Screen Form**: Unlike popup dialogs, the add exam schedule form uses a dedicated full-screen page
- **Consistent Design**: Follows the same design pattern as other add forms in the system (e.g., AddExam, AddClass)
- **Responsive Layout**: Optimized for both desktop and mobile devices
- **Material-UI Components**: Uses modern Material-UI components for a polished look and feel

### Navigation Flow

- **Main List View**: Users start at `/exam-schedules` with a clean table view
- **Add Button**: Clicking "Tạo lịch thi" navigates to `/exam-schedules/add`
- **Form Submission**: After successful creation, users are redirected back to the main list
- **Cancel Option**: Users can cancel and return to the main list at any time

## Frontend Components

### AddExamSchedule Component

- **Location**: `frontend/frontend/src/components/AddExamSchedule.js`
- **Purpose**: Form component for creating new exam schedules
- **Features**:
  - Dropdown selections for exam, class, and instructor
  - Date and time pickers
  - Form validation
  - Success/error handling

### ExamScheduleTable Component

- **Location**: `frontend/frontend/src/components/ExamScheduleTable.js`
- **Purpose**: Display and manage exam schedules
- **Features**:
  - Data grid with search functionality
  - "Create Exam Schedule" button that navigates to add page
  - Clean, focused interface for viewing schedules

### AddExamSchedule Component

- **Location**: `frontend/frontend/src/pages/AddExamSchedule.js`
- **Purpose**: Standalone page for adding exam schedules
- **Features**: Wrapper component that can be used independently

## Backend Components

### DTOs

- **ExamScheduleCreateRequest**: Request DTO for creating exam schedules
  - Location: `src/main/java/com/example/m_bl5_g4_su25/dto/request/ExamScheduleCreateRequest.java`
  - Validation: Required fields (examId, examDate, startTime), optional fields (classId, instructorId, location, maxParticipants)

### Service Layer

- **ExamScheduleService**: Business logic for exam schedule operations
  - Location: `src/main/java/com/example/m_bl5_g4_su25/service/ExamScheduleService.java`
  - Methods: `getAllExamSchedules()`, `createExamSchedule()`

### Controller Layer

- **ExamScheduleController**: REST API endpoints
  - Location: `src/main/java/com/example/m_bl5_g4_su25/controller/ExamScheduleController.java`
  - Endpoints:
    - `GET /exam-schedules`: Get all exam schedules
    - `POST /exam-schedules`: Create new exam schedule

## API Endpoints

### Create Exam Schedule

```
POST /exam-schedules
Content-Type: application/json
Authorization: Bearer {jwt_token}

{
  "examId": 1,
  "classId": 2,
  "instructorId": 3,
  "examDate": "2024-01-15",
  "startTime": "09:00",
  "location": "Room 101",
  "maxParticipants": 30
}
```

### Response

```json
{
  "result": {
    "id": 1,
    "examName": "Theory Exam A1",
    "className": "Class A1-001",
    "examDate": "2024-01-15",
    "startTime": "09:00",
    "location": "Room 101",
    "maxParticipants": 30,
    "instructorName": "John Doe"
  }
}
```

## Usage

### 1. From Exam Schedule List

1. Navigate to `/exam-schedules`
2. Click the "Tạo lịch thi" (Create Exam Schedule) button
3. You'll be taken to a full-screen form page
4. Fill out the form with required information
5. Submit to create the exam schedule

### 2. Direct Access

1. Navigate to `/exam-schedules/add`
2. Fill out the form
3. Submit to create the exam schedule

## Database Schema

The feature uses the existing `ExamSchedules` table with the following structure:

- `schedule_id` (Primary Key)
- `exam_id` (Foreign Key to Exams table)
- `class_id` (Foreign Key to Classes table, nullable)
- `instructor_id` (Foreign Key to Users table, nullable)
- `exam_date` (Date)
- `start_time` (Time)
- `location` (VARCHAR, nullable)
- `max_participants` (Integer, nullable)

## Dependencies

### Frontend

- React 18+
- Material-UI (MUI)
- Axios for HTTP requests
- React Router for navigation

### Backend

- Spring Boot 3.x
- Spring Data JPA
- Hibernate
- Jakarta Validation

## Security

- JWT token authentication required for all endpoints
- Admin role validation (implemented at service layer)

## Error Handling

- Frontend: User-friendly error messages with Material-UI Alert components
- Backend: Proper exception handling with meaningful error messages
- Validation: Input validation using Jakarta Validation annotations

## Future Enhancements

- Edit exam schedule functionality
- Delete exam schedule functionality
- Bulk exam schedule creation
- Conflict detection for overlapping schedules
- Email notifications for scheduled exams
- Calendar view of exam schedules
