# Learner Exam Schedule Feature

## Overview

This feature allows learners to view a list of all exam schedules associated with them. Learners can see their upcoming exams, registration status, and exam results in a user-friendly interface.

## Features

- **View Personal Exam Schedules**: Learners can see all exam schedules for classes they are enrolled in
- **Registration Status**: Shows whether the learner has registered for each exam and the current status
- **Exam Results**: Displays exam scores when available
- **Responsive Design**: Mobile-friendly interface with Material-UI components
- **Role-Based Access**: Different navigation menus for learners vs. admin/instructors

## Backend Implementation

### New DTO

- `LearnerExamScheduleResponse.java` - Response DTO containing exam schedule information for learners

### New Service Method

- `getExamSchedulesForLearner(Long learnerId)` - Retrieves exam schedules for a specific learner

### New Repository Methods

- `ExamResultRepository.findByLearnerIdAndExamScheduleId()` - Finds exam results by learner and exam schedule
- `ExamScheduleRepository.findByClassFieldLearnersId()` - Finds exam schedules where learner is enrolled
- `ExamRegistrationRepository.findByLearnerIdAndExamScheduleId()` - Finds exam registrations by learner and exam schedule

### New API Endpoint

- `GET /exam-schedules/learner/{learnerId}` - Returns exam schedules for a specific learner

## Frontend Implementation

### New Page

- `LearnerExamSchedule.js` - Main page for learners to view their exam schedules

### Features

- DataGrid with pagination and search
- Status indicators with color-coded chips
- Navigation to detailed exam schedule views
- Responsive design for mobile devices
- Error handling and loading states

### Navigation

- Added to ResponsiveAppBar with role-based access control
- Learners see "Lịch thi của tôi" (My Exam Schedules) in their navigation
- Admins/Instructors see the full management menu

## Usage

### For Learners

1. Navigate to "Lịch thi của tôi" from the main navigation
2. View all exam schedules for enrolled classes
3. Check registration status and exam results
4. Click on the eye icon to view detailed exam information

### For Developers

1. The feature automatically detects user role from localStorage
2. Learners are redirected to `/my-exam-schedules`
3. The API endpoint requires authentication and returns learner-specific data

## Technical Details

### Data Flow

1. Frontend gets learner ID from localStorage
2. API call to `/exam-schedules/learner/{learnerId}`
3. Backend queries exam schedules where learner is enrolled
4. Returns formatted response with registration status and exam results

### Security

- JWT token authentication required
- Learners can only access their own exam schedules
- Role-based access control in navigation

### Performance

- Efficient database queries using JPA relationships
- Pagination support in frontend DataGrid
- Lazy loading of related entities

## Future Enhancements

- Email notifications for upcoming exams
- Calendar view of exam schedules
- Export functionality for exam schedules
- Integration with mobile apps
- Push notifications for exam reminders
