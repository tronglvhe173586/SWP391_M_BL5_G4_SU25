import React, { useState } from "react";
import { Container, TextField, Button, Typography, Box, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AddLearner() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    learnerId: "",
    classId: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("jwtToken");
      await axios.post(
        "http://localhost:8080/driving-school-management/enrollments",
        {
          learnerId: parseInt(form.learnerId),
          classId: parseInt(form.classId)
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Thêm học viên thành công!");
      setForm({
        learnerId: "",
        classId: ""
      });
      navigate("/class/:id/learners");
    } catch (error) {
      console.error(error);
      alert("Thêm học viên thất bại!");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Thêm Học Viên Vào Lớp
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <TextField
          label="ID Học Viên"
          name="learnerId"
          value={form.learnerId}
          onChange={handleChange}
          required
          fullWidth
        />
        <TextField
          label="ID Lớp Học"
          name="classId"
          value={form.classId}
          onChange={handleChange}
          required
          fullWidth
        />
        <Button type="submit" variant="contained" color="primary">
          Thêm
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => navigate("/class/:id/learners")}
        >
          Hủy
        </Button>
      </Box>
    </Container>
  );
}