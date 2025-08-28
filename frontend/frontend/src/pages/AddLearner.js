import React, { useState, useEffect } from "react";
import { Container, TextField, Button, Typography, Box, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

export default function AddLearner() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preFilledClassId = searchParams.get("classId") || "";
  const [learners, setLearners] = useState([]);
  const [form, setForm] = useState({
    learnerId: "",
    classId: preFilledClassId,
  });

  useEffect(() => {
    const fetchLearners = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        const res = await axios.get("http://localhost:8080/driving-school-management/users?role=LEARNER", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLearners(res.data);
      } catch (err) {
        console.error("Error fetching learners:", err);
      }
    };
    fetchLearners();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
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
          classId: parseInt(form.classId),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Thêm học viên thành công!");
      setForm({
        learnerId: "",
        classId: preFilledClassId,
      });
      navigate(`/enrollments?classId=${form.classId}`);
    } catch (error) {
      console.error(error);
      alert(`Thêm học viên thất bại: ${error.response?.data?.message || error.message}`);
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
        <FormControl fullWidth>
          <InputLabel>Học Viên</InputLabel>
          <Select
            name="learnerId"
            value={form.learnerId}
            onChange={handleChange}
            required
            label="Học Viên"
          >
            <MenuItem value="">Chọn học viên</MenuItem>
            {learners.map((learner) => (
              <MenuItem key={learner.id} value={learner.id}>
                {learner.firstName} {learner.lastName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="ID Lớp Học"
          name="classId"
          value={form.classId}
          onChange={handleChange}
          required
          fullWidth
          disabled={!!preFilledClassId}
        />
        <Button type="submit" variant="contained" color="primary">
          Thêm
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => navigate(`/enrollments?classId=${form.classId}`)}
        >
          Hủy
        </Button>
      </Box>
    </Container>
  );
}