import React, { useState } from "react";
import { Container, TextField, Button, Typography, Box, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AddClass() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    className: "",
    startDate: "",
    endDate: "",
    maxStudents: "",
    courseId: "",
    instructorId: ""
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
        "http://localhost:8080/driving-school-management/classes",
        {
          className: form.className,
          startDate: form.startDate,
          endDate: form.endDate,
          maxStudents: parseInt(form.maxStudents),
          courseId: parseInt(form.courseId),
          instructorId: parseInt(form.instructorId)
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }

      );
      alert("Thêm lớp học thành công!");
      setForm({
        className: "",
        startDate: "",
        endDate: "",
        maxStudents: "",
        courseId: "",
        instructorId: ""
      });
      navigate("/classes");
    } catch (error) {
      console.error(error);
      alert("Thêm lớp học thất bại!");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Thêm Lớp Học
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <TextField
          label="Tên Lớp"
          name="className"
          value={form.className}
          onChange={handleChange}
          required
          fullWidth
        />
        <TextField
          label="Ngày Bắt Đầu"
          name="startDate"
          type="date"
          value={form.startDate}
          onChange={handleChange}
          required
          fullWidth
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Ngày Kết Thúc"
          name="endDate"
          type="date"
          value={form.endDate}
          onChange={handleChange}
          required
          fullWidth
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Sĩ Số Tối Đa"
          name="maxStudents"
          value={form.maxStudents}
          onChange={handleChange}
          type="number"
          required
          fullWidth
          inputProps={{ min: 1 }}
        />
        <TextField
          label="ID Khóa Học"
          name="courseId"
          value={form.courseId}
          onChange={handleChange}
          type="number"
          required
          fullWidth
        />
        <TextField
          label="ID Giảng Viên"
          name="instructorId"
          value={form.instructorId}
          onChange={handleChange}
          type="number"
          required
          fullWidth
        />
        <Button type="submit" variant="contained" color="primary">
          Thêm
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => navigate("/classes")}
        >
          Hủy
        </Button>
      </Box>
    </Container>
  );
}