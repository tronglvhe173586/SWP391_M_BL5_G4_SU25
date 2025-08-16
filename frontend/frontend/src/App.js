import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ResponsiveAppBar from "./components/ResponsiveAppBar.js";
import UserManagement from "./pages/userManagement.js";
import AddInstructor from "./pages/AddInstructor.js";
import EditUser from "./pages/editUser.js";
import ExamList from "./pages/ExamList.js";
import AddExam from "./pages/AddExam.js";
import EditExam from "./pages/EditExam.js";
import Login from './pages/Login.js';
import UserDetails from "./pages/UserDetails.js";
import Register from "./pages/Register.js";
import ClassManagement from './pages/ClassManagement';
import AddClass from './pages/AddClass';
import ViewClass from './pages/ViewClass';
import EditClass from './pages/EditClass';


function App() {
  return (
    <Router>
      <ResponsiveAppBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/user-management" element={<UserManagement />} />
        <Route path="/add-instructor" element={<AddInstructor />} />

        <Route path="/edit-user/:id" element={<EditUser />} />
        {/* New routes for Class Management */}
        <Route path="/class-management" element={<ClassManagement />} />
        <Route path="/add-class" element={<AddClass />} />
        <Route path="/view-class/:id" element={<ViewClass />} />
        <Route path="/edit-class/:id" element={<EditClass />} />

        <Route path="/users/edit/:id" element={<EditUser />} />

        <Route path="/exams" element={<ExamList />} />
        <Route path="/exams/add" element={<AddExam />} />
        <Route path="/exams/edit/:id" element={<EditExam />} />
          <Route path="/register" element={<Register />} />
          <Route path="/users/:id" element={<UserDetails />} />
          <Route path="/login" element={<Login />} />

      </Routes>
    </Router>
  );
}

export default App;