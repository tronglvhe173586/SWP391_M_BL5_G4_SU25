import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.js";
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
import ClassLearners from './pages/ClassLearners';
import Authenticate from "./pages/Authenticate.js";


function App() {
  return (
    <Router>
      <ResponsiveAppBar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/add-instructor" element={<AddInstructor />} />

        <Route path="/edit-user/:id" element={<EditUser />} />
        {/* New routes for Class Management */}
        <Route path="/classes" element={<ClassManagement />} />
        <Route path="/classes/add" element={<AddClass />} />
        <Route path="/classes/:id" element={<ViewClass />} />
        <Route path="/classes/edit/:id" element={<EditClass />} />
        <Route path="/class/:id/learners" element={<ClassLearners />} />

        <Route path="/users/edit/:id" element={<EditUser />} />
        <Route path="/exams" element={<ExamList />} />
        <Route path="/exams/add" element={<AddExam />} />
        <Route path="/exams/edit/:id" element={<EditExam />} />
          <Route path="/register" element={<Register />} />
          <Route path="/users/:id" element={<UserDetails />} />
        <Route path="/authenticate" element={<Authenticate />} />

      </Routes>
    </Router>
  );
}

export default App;