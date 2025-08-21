import React from "react";
import CourseTable from "../components/courseTable";
import { Container, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

export default function CourseManagement() {
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
