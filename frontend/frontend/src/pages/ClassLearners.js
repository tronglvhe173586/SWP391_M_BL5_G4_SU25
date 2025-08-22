import React from "react";
import LearnerTable from "../components/LearnerTable";
import { Container, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

export default function ClassLearners() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Danh Sách Học Viên Trong Lớp
      </Typography>
      <LearnerTable />
      <Link to="/enrollments/add">
        <Button variant="contained" color="success" sx={{ mt: 10 }}>
          Thêm Học Viên
        </Button>
      </Link>
    </Container>
  );
}