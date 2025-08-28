import React from "react";
import LearnerTable from "../components/LearnerTable";
import { Container, Typography, Button } from "@mui/material";
import { Link, useSearchParams } from "react-router-dom";

export default function ClassLearners() {
  const [searchParams] = useSearchParams();
  const classId = searchParams.get("classId");

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Danh Sách Học Viên Trong Lớp {classId ? `#${classId}` : ""}
      </Typography>
      <LearnerTable classId={classId} />
      <Link to={`/enrollments/add?classId=${classId}`}>
        <Button variant="contained" color="success" sx={{ mt: 2 }}>
          Thêm Học Viên
        </Button>
      </Link>
    </Container>
  );
}