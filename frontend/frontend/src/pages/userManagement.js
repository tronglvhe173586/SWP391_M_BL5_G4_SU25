import React from "react";
import UserTable from "../components/userTable";
import { Container, Typography, Button } from "@mui/material";
import { Link, Navigate } from "react-router-dom";

export default function UserManagement() {
  const userRole = localStorage.getItem("userRole") || "ROLE_LEARNER";
  if (userRole !== "ROLE_ADMIN") {
    alert("Bạn không có quyền truy cập trang này.");
    return <Navigate to="/" replace />;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Quản lý tài khoản
      </Typography>
      <UserTable />
      <Link to="/add-instructor">
        <Button variant="contained" color="success" sx={{ mt: 10 }}>
          Thêm giảng viên
        </Button>
      </Link>
    </Container>
  );
}
