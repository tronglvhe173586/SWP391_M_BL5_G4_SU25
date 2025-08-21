import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const EditClass = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    className: "",
    startDate: "",
    endDate: "",
    maxStudents: "",
    courseId: "",
    instructorId: ""
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClass = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        console.log("Fetching class with ID:", id);

        const res = await axios.get(
          `http://localhost:8080/driving-school-management/classes/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        console.log("Class data received:", res.data);
        setForm({
          className: res.data.className,
          startDate: res.data.startDate,
          endDate: res.data.endDate,
          maxStudents: res.data.maxStudents,
          courseId: res.data.courseId,
          instructorId: res.data.instructorId
        });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching class:", err);
        console.error("Error response:", err.response?.data);
        alert(`Không thể tải dữ liệu lớp học: ${err.response?.data?.message || err.message}`);
        setLoading(false);
      }
    };
    fetchClass();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Updating class with ID:", id);
      console.log("Form data:", form);
      const updateData = {
        className: form.className,
        startDate: form.startDate,
        endDate: form.endDate,
        maxStudents: parseInt(form.maxStudents),
        courseId: parseInt(form.courseId),
        instructorId: parseInt(form.instructorId)
      };
      console.log("Sending update data:", updateData);

      const token = localStorage.getItem("jwtToken");

      const res = await axios.put(
        `http://localhost:8080/driving-school-management/classes/${id}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log("Update response:", res.data);
      alert("Cập nhật lớp học thành công!");
      navigate("/classes");
    } catch (err) {
      console.error("Error updating class:", err);
      console.error("Error response:", err.response?.data);
      alert(`Cập nhật lớp học thất bại: ${err.response?.data?.message || err.message}`);
    }
  };

  if (loading) return <Typography>Đang tải dữ liệu lớp học...</Typography>;

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" mb={3}>
        Chỉnh Sửa Lớp Học
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
          fullWidth
          required
        />
        <TextField
          label="Ngày Bắt Đầu"
          name="startDate"
          type="date"
          value={form.startDate}
          onChange={handleChange}
          fullWidth
          required
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Ngày Kết Thúc"
          name="endDate"
          type="date"
          value={form.endDate}
          onChange={handleChange}
          fullWidth
          required
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Sĩ Số Tối Đa"
          name="maxStudents"
          type="number"
          value={form.maxStudents}
          onChange={handleChange}
          fullWidth
          required
          inputProps={{ min: 1 }}
        />
        <TextField
          label="ID Khóa Học"
          name="courseId"
          value={form.courseId}
          onChange={handleChange}
          type="number"
          fullWidth
          required
        />
        <TextField
          label="ID Giảng Viên"
          name="instructorId"
          value={form.instructorId}
          onChange={handleChange}
          type="number"
          fullWidth
          required
        />
        <Button variant="contained" color="primary" type="submit">
          Cập nhật
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

};

export default EditClass;