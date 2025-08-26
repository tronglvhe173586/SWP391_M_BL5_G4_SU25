import React from "react";
import CourseTable from "../components/courseTable";
import { Container, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function CourseManagement() {
 const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole") || "ROLE_LEARNER";
    useEffect(() => {
        if (userRole !== "ROLE_ADMIN" && userRole !== "ROLE_INSTRUCTOR") {
          navigate("/")
          alert("Bạn không có quyền truy cập trang này."); 
          return;
        }
      }
      );

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Quản lý khóa học
      </Typography>
      <CourseTable />
      <Link to="/add_courses">
        <Button variant="contained" color="success" sx={{ mt: 10 }}>
          Thêm khóa học
        </Button>
      </Link>
    </Container>
    
  );
}
