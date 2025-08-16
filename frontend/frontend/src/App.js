import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ResponsiveAppBar from './components/ResponsiveAppBar';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import UserManagement from './pages/userManagement';
import AddInstructor from './pages/AddInstructor';
import EditUser from './pages/editUser';
// New imports for Class Management
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
      </Routes>
    </Router>
  );
}

export default App;