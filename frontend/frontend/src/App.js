import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage.js";
import ResponsiveAppBar from "./components/ResponsiveAppBar.js";
import UserManagement from "./pages/userManagement.js";
import AddInstructor from "./pages/AddInstructor.js";
import EditUser from "./pages/editUser.js";
import ExamList from "./pages/ExamList.js";
import AddExam from "./pages/AddExam.js";
import EditExam from "./pages/EditExam.js";
import ExamScheduleList from "./pages/ExamScheduleList.js";
import EditExamSchedule from "./pages/EditExamSchedule.js";
import ViewExamSchedule from "./pages/ViewExamSchedule.js";
import AddExamSchedule from "./pages/AddExamSchedule";
import Login from './pages/Login.js';
import UserDetails from "./pages/UserDetails.js";
import Register from "./pages/Register.js";
import ClassManagement from './pages/ClassManagement';
import AddClass from './pages/AddClass';
import ViewClass from './pages/ViewClass';
import EditClass from './pages/EditClass';
import ClassLearners from './pages/ClassLearners';
import AddLearner from './pages/AddLearner';
import ViewLearner from './pages/ViewLearner';
import EditLearner from './pages/EditLearner';
import Authenticate from "./pages/Authenticate.js";
import ForgotPassword from "./pages/ForgotPassword.js";
import VerifyOtp from "./pages/VerifyOTP.js";
import ChangePassword from "./pages/ChangePassword.js";
import CourseManagement from './pages/CourseManagement.js';
import AddCourse from './pages/AddCourse.js';
import EditCourse from './pages/EditCourse.js';
import CourseDetail from './pages/CourseDetails.js';
import ClassListByCourse from './pages/ClassListByCourse.js';
import ExamRegistration from './pages/ExamRegistration.js';
import ExamRegistrationManagement from './pages/ExamRegistrationManagement.js';
import LearnerProfilePage from './pages/LearnerProfile.js';
import ViewSchedule from "./pages/ViewSchedule";

function AppContent() {
  const location = useLocation();
  const hideAppBarPaths = ['/', '/login'];
  const shouldHideAppBar = hideAppBarPaths.includes(location.pathname);

  return (
    <>
      {!shouldHideAppBar && <ResponsiveAppBar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/courses" element={<CourseManagement />} />
        <Route path="/add_courses" element={<AddCourse />} />
        <Route path="/courses/edit/:id" element={<EditCourse />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/courses/:courseId/classes" element={<ClassListByCourse />} />
        <Route path="/users/:id/profile" element={<LearnerProfilePage />} />
        <Route path="/add-instructor" element={<AddInstructor />} />

        <Route path="/edit-user/:id" element={<EditUser />} />

        <Route path="/classes" element={<ClassManagement />} />
        <Route path="/classes/add" element={<AddClass />} />
        <Route path="/classes/:id" element={<ViewClass />} />
        <Route path="/classes/edit/:id" element={<EditClass />} />
        <Route path="/class/:id/learners" element={<ClassLearners />} />
        <Route path="/enrollments/add" element={<AddLearner />} />
        <Route path="/enrollments/:id" element={<ViewLearner />} />
        <Route path="/enrollments/edit/:id" element={<EditLearner />} />

        <Route path="/users/edit/:id" element={<EditUser />} />
        <Route path="/exams" element={<ExamList />} />
        <Route path="/exams/add" element={<AddExam />} />
        <Route path="/exams/edit/:id" element={<EditExam />} />
        <Route path="/exam-schedules" element={<ExamScheduleList />} />
        <Route path="/exam-schedules/edit/:id" element={<EditExamSchedule />} />
        <Route path="/exam-schedules/:id" element={<ViewExamSchedule />} />
        <Route path={"/exam-schedules/add"} element={<AddExamSchedule />} />
        <Route path="/exam-registration" element={<ExamRegistration />} />
        <Route path="/exam-registration-management" element={<ExamRegistrationManagement />} />

        <Route path="/register" element={<Register />} />
        <Route path="/users/:id" element={<UserDetails />} />
        <Route path="/authenticate" element={<Authenticate />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path= "/verify-otp" element={<VerifyOtp />} />
        <Route path="/change-password" element={<ChangePassword />} />

        <Route path="/view-schedule" element={<ViewSchedule />} />

      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;