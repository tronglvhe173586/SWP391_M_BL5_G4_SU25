import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UserManagement from "./pages/userManagement";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/users" element={<UserManagement />} />
      </Routes>
    </Router>
  );
}

export default App;
