
import React from "react";
import ClassTable from "../components/ClassTable";
import { Container, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

export default function ClassManagement() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Quản Lý Lớp Học
      </Typography>
      <ClassTable />
      <Link to="/classes/add">
        <Button variant="contained" color="success" sx={{ mt: 10 }}>
          Tạo Lớp Học
        </Button>
      </Link>
    </Container>
  );
}

