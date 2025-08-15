import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ResponsiveAppBar from "./components/ResponsiveAppBar.js";
import UserManagement from "./pages/userManagement.js";
import AddInstructor from "./pages/AddInstructor.js";
import EditUser from "./pages/editUser.js";
import ExamList from "./pages/ExamList.js";
import AddExam from "./pages/AddExam.js";
import EditExam from "./pages/EditExam.js";
function App() {
  return (
    <Router>
      <ResponsiveAppBar />
      <Routes>
        <Route path="/users" element={<UserManagement />} />
        <Route path="/add-instructor" element={<AddInstructor />} />
        <Route path="/users/edit/:id" element={<EditUser />} />
        <Route path="/exams" element={<ExamList />} />
        <Route path="/exams/add" element={<AddExam />} />
        <Route path="/exams/edit/:id" element={<EditExam />} />
      </Routes>
    </Router>
  );
}

export default App;
