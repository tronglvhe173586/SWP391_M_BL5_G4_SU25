import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ResponsiveAppBar from "./components/ResponsiveAppBar.js";
import UserManagement from "./pages/userManagement.js";
import AddInstructor from "./pages/AddInstructor.js";
import EditUser from "./pages/editUser.js";
function App() {
  return (
    <Router>
      <ResponsiveAppBar />
      <Routes>
        <Route path="/users" element={<UserManagement />} />
        <Route path="/add-instructor" element={<AddInstructor />} />
        <Route path="/users/edit/:id" element={<EditUser />} />

      </Routes>
    </Router>
  );
}

export default App;
