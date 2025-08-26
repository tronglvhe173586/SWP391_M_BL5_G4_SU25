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

const EditExam = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    examName: "",
    examType: "THEORY",
    passScore: ""
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        console.log("Fetching exam with ID:", id);

        const res = await axios.get(
          `http://localhost:8080/driving-school-management/exams/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        console.log("Exam data received:", res.data);
        setForm({
          examName: res.data.examName,
          examType: res.data.examType,
          passScore: res.data.passScore
        });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching exam:", err);
        console.error("Error response:", err.response?.data);
        alert(`Không thể tải dữ liệu kỳ thi: ${err.response?.data?.message || err.message}`);
        setLoading(false);
      }
    };
    fetchExam();
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
      console.log("Updating exam with ID:", id);
      console.log("Form data:", form);
      const updateData = {
        examName: form.examName,
        examType: form.examType,
        passScore: parseInt(form.passScore)
      };
      console.log("Sending update data:", updateData);

      const token = localStorage.getItem("jwtToken");

      const res = await axios.put(
        `http://localhost:8080/driving-school-management/exams/${id}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log("Update response:", res.data);
      alert("Cập nhật kỳ thi thành công!");
      navigate("/exams");
    } catch (err) {
      console.error("Error updating exam:", err);
      console.error("Error response:", err.response?.data);
      alert(`Cập nhật kỳ thi thất bại: ${err.response?.data?.message || err.message}`);
    }
  };

  if (loading) return <Typography>Đang tải dữ liệu kỳ thi...</Typography>;

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" mb={3}>
        Chỉnh sửa kỳ thi
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
          fullWidth
          required
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
          type="number"
          value={form.passScore}
          onChange={handleChange}
          fullWidth
          required
          inputProps={{ min: 0, max: 100 }}
        />

        <Button variant="contained" color="primary" type="submit">
          Cập nhật
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
};

export default EditExam;
