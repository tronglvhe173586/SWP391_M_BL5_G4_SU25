import React, { useState, useEffect } from "react";
import { Container, TextField, Button, Typography, Box, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import axios from "axios";

export default function EditLearner() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const classId = searchParams.get("classId") || "";
  const navigate = useNavigate();
  const [form, setForm] = useState({
    status: "ENROLLED",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrollment = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        const res = await axios.get(
          `http://localhost:8080/driving-school-management/enrollments/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setForm({
          status: res.data.status,
        });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching enrollment:", err);
        alert(`Không thể tải dữ liệu đăng ký: ${err.response?.data?.message || err.message}`);
        setLoading(false);
      }
    };
    fetchEnrollment();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updateData = {
        status: form.status,
      };
      const token = localStorage.getItem("jwtToken");
      await axios.put(
        `http://localhost:8080/driving-school-management/enrollments/${id}`,
        updateData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Cập nhật đăng ký thành công!");
      navigate(`/enrollments?classId=${classId}`);
    } catch (err) {
      console.error("Error updating enrollment:", err);
      alert(`Cập nhật đăng ký thất bại: ${err.response?.data?.message || err.message}`);
    }
  };

  if (loading) return <Typography>Đang tải dữ liệu đăng ký...</Typography>;

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" mb={3}>
        Chỉnh Sửa Đăng Ký Học Viên
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <FormControl fullWidth>
          <InputLabel>Trạng Thái</InputLabel>
          <Select
            name="status"
            value={form.status}
            onChange={handleChange}
            label="Trạng Thái"
          >
            <MenuItem value="ENROLLED">Đã Đăng Ký</MenuItem>
            <MenuItem value="DROPPED">Đã Rút</MenuItem>
            <MenuItem value="COMPLETED">Đã Hoàn Thành</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" color="primary" type="submit">
          Cập nhật
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => navigate(`/enrollments?classId=${classId}`)}
        >
          Hủy
        </Button>
      </Box>
    </Container>
  );
}