import React, { useState } from "react";
import { Container, TextField, Button, Typography, Box, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AddExam() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    examName: "",
    examType: "THEORY",
    passScore: ""
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
        "http://localhost:8080/driving-school-management/exams",
        {
          examName: form.examName,
          examType: form.examType,
          passScore: parseInt(form.passScore)
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Thêm kỳ thi thành công!");
      setForm({
        examName: "",
        examType: "THEORY",
        passScore: ""
      });
      navigate("/exams");
    } catch (error) {
      console.error(error);
      alert("Thêm kỳ thi thất bại!");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Thêm kỳ thi
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <TextField
          label="Tên kỳ thi"
          name="examName"
          value={form.examName}
          onChange={handleChange}
          required
          fullWidth
        />
        
        <FormControl fullWidth>
          <InputLabel>Loại kỳ thi</InputLabel>
          <Select
            name="examType"
            value={form.examType}
            onChange={handleChange}
            label="Loại kỳ thi"
          >
            <MenuItem value="THEORY">Lý thuyết</MenuItem>
            <MenuItem value="SIMULATION">Mô phỏng</MenuItem>
            <MenuItem value="PRACTICAL">Thực hành</MenuItem>
            <MenuItem value="ON_THE_ROAD">Đường trường</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Điểm đạt"
          name="passScore"
          value={form.passScore}
          onChange={handleChange}
          type="number"
          required
          fullWidth
          inputProps={{ min: 0, max: 100 }}
        />

        <Button type="submit" variant="contained" color="primary">
          Thêm
        </Button>
        
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => navigate("/exams")}
        >
          Hủy
        </Button>
      </Box>
    </Container>
  );
}
