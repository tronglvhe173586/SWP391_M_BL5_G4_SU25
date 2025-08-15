import React from "react";
import ExamTable from "../components/ExamTable";
import { Container, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

export default function ExamList() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Exam Management
      </Typography>
      <ExamTable />
      <Link to="/exams/add">
        <Button variant="contained" color="success" sx={{ mt: 10 }}>
          Add Exam
        </Button>
      </Link>
    </Container>
  );
}
