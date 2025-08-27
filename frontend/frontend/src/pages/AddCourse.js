import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AddCourse() {
  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole") || "ROLE_LEARNER";

  useEffect(() => {
    if (userRole !== "ROLE_ADMIN") {
      alert("Bạn không có quyền truy cập trang này.");
      navigate("/");
    }
  }, [userRole, navigate]);

  const [form, setForm] = useState({
    courseName: "",
    courseType: "",
    description: "",
    price: "",
    duration: "",
    isDeleted: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Chặn ký tự không phải số cho price và duration
    if ((name === "price" || name === "duration") && value !== "") {
      if (!/^\d*$/.test(value)) return; // chỉ cho số
    }

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.courseName.trim()) {
      alert("Tên khóa học không được để trống");
      return;
    }

    if (Number(form.price) <= 0) {
      alert("Giá phải lớn hơn 0");
      return;
    }

    if (Number(form.duration) <= 0) {
      alert("Thời lượng phải lớn hơn 0");
      return;
    }

    try {
      const token = localStorage.getItem("jwtToken");
      await axios.post(
        "http://localhost:8080/driving-school-management/courses/add_courses",
        {
          ...form,
          price: Number(form.price),
          duration: Number(form.duration),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Thêm khóa học thành công!");
      setForm({
        courseName: "",
        courseType: "",
        description: "",
        price: "",
        duration: "",
        isDeleted: false,
      });
      navigate("/courses");
    } catch (error) {
      console.error(error);
      alert("Thêm khóa học thất bại! Vui lòng kiểm tra lại dữ liệu.");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Thêm Khóa Học
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <TextField
          label="Tên khóa học"
          name="courseName"
          value={form.courseName}
          onChange={handleChange}
          required
        />

        <FormControl fullWidth>
          <InputLabel>Loại khóa học</InputLabel>
          <Select
            name="courseType"
            value={form.courseType}
            onChange={handleChange}
            label="Loại khóa học"
            required
          >
            <MenuItem value="A1">A1</MenuItem>
            <MenuItem value="A2">A2</MenuItem>
            <MenuItem value="B1">B1</MenuItem>
            <MenuItem value="B2">B2</MenuItem>
            <MenuItem value="C">C</MenuItem>
            <MenuItem value="D">D</MenuItem>
            <MenuItem value="E">E</MenuItem>
            <MenuItem value="F">F</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Mô tả"
          name="description"
          value={form.description}
          onChange={handleChange}
          multiline
          rows={3}
          required
        />

        <TextField
          label="Giá (VNĐ)"
          name="price"
          value={form.price}
          onChange={handleChange}
          required
          inputProps={{ min: 1 }}
        />

        <TextField
          label="Thời lượng (giờ)"
          name="duration"
          value={form.duration}
          onChange={handleChange}
          required
          inputProps={{ min: 1 }}
        />

        <Button type="submit" variant="contained">
          Thêm Khóa Học
        </Button>
      </Box>
    </Container>
  );
}
