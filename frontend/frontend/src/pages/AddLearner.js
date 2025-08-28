import React, { useState, useEffect } from "react";
import { Container, TextField, Button, Typography, Box, Select, MenuItem, FormControl, InputLabel, Snackbar, Alert } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

export default function AddLearner() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preFilledClassId = searchParams.get("classId") || "";
  const [learners, setLearners] = useState([]);
  const [classes, setClasses] = useState([]);
  const [form, setForm] = useState({
    learnerId: "",
    classId: preFilledClassId,
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        const [learnerRes, classRes] = await Promise.all([
          axios.get("http://localhost:8080/driving-school-management/users?role=LEARNER", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:8080/driving-school-management/classes", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        if (learnerRes.data.length === 0) {
          setError("Không tìm thấy học viên nào.");
        } else {
          setLearners(learnerRes.data);
        }
        setClasses(classRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(`Lỗi khi tải dữ liệu: ${err.response?.data?.message || err.message}`);
      }
    };
    fetchData();
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
      if (!form.learnerId || !form.classId) {
        setError("Vui lòng chọn học viên và lớp học.");
        return;
      }
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
      setError(null);
      alert("Thêm học viên thành công!");
      setForm({
        learnerId: "",
        classId: preFilledClassId,
      });
      navigate(`/enrollments?classId=${form.classId}`);
    } catch (error) {
      console.error(error);
      setError(`Thêm học viên thất bại: ${error.response?.data?.message || error.message}`);
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
        <FormControl fullWidth>
          <InputLabel>Lớp Học</InputLabel>
          <Select
            name="classId"
            value={form.classId}
            onChange={handleChange}
            required
            label="Lớp Học"
            disabled={!!preFilledClassId}
          >
            <MenuItem value="">Chọn lớp học</MenuItem>
            {classes.map((cls) => (
              <MenuItem key={cls.id} value={cls.id}>
                {cls.className}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
}