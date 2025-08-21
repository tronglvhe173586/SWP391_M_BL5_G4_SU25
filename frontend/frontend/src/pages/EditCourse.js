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
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const EditCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    courseName: "",
    courseType: "A1", // mặc định
    description: "",
    price: "",
    duration: "",
    isDeleted: false,
  });

  const [loading, setLoading] = useState(true);

  // Lấy dữ liệu course
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        const res = await axios.get(
          `http://localhost:8080/driving-school-management/courses/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setForm({
          courseName: res.data.courseName,
          courseType: res.data.courseType,
          description: res.data.description,
          price: res.data.price,
          duration: res.data.duration,
          isDeleted: res.data.isDeleted,
        });
        setLoading(false);
      } catch (err) {
        console.error(err);
        alert("Không thể tải dữ liệu khóa học");
      }
    };
    fetchCourse();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("jwtToken");
      await axios.put(
        `http://localhost:8080/driving-school-management/courses/edit_courses/${id}`,
        form,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Cập nhật khóa học thành công!");
      navigate("/courses");
    } catch (err) {
      console.error(err);
      alert("Cập nhật khóa học thất bại");
    }
  };

  if (loading) return <Typography>Đang tải dữ liệu khóa học...</Typography>;

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" mb={3}>
        Chỉnh sửa khóa học
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
          fullWidth
          required
        />

        {/* CourseType (Enum) */}
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
          fullWidth
          multiline
          rows={3}
        />

        <TextField
          label="Học phí"
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          fullWidth
          required
        />

        <TextField
          label="Thời lượng"
          name="duration"
          value={form.duration}
          onChange={handleChange}
          fullWidth
          required
        />

        <FormControlLabel
          control={
            <Checkbox
              name="isDeleted"
              checked={form.isDeleted}
              onChange={handleChange}
            />
          }
          label="Đã xóa (ẩn khóa học)"
        />

        <Button variant="contained" color="primary" type="submit">
          Cập nhật
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => navigate("/courses")}
        >
          Hủy
        </Button>
      </Box>
    </Container>
  );
};

export default EditCourse;
