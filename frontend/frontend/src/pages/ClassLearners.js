import React from "react";
import LearnerTable from "../components/LearnerTable";
import { Container, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

export default function ClassLearners() {
  const { id } = useParams();

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Danh Sách Học Viên Trong Lớp
      </Typography>
      <LearnerTable classId={id} />
      <Link to={`/enrollments/add?classId=${id}`}>
        <Button variant="contained" color="success" sx={{ mt: 10 }}>
          Thêm Học Viên
        </Button>
      </Link>
    </Container>
  );
}