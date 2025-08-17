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

export default function AddInstructor() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    passwordHash: "",
    email: "",
    firstName: "",
    lastName: "",
    gender: "Nam", // mặc định Enum Nam
    provinceId: "", // id tỉnh
    address: "",
    phoneNumber: "",
    certificationInfo: "Bằng lái hạng A1",
    dateOfBirth: "", // 👈 thêm ngày sinh
  });

  const [provinces, setProvinces] = useState([]);

  // Lấy danh sách provinces từ backend
  useEffect(() => {
    axios
      .get("http://localhost:8080/driving-school-management/provinces")
      .then((res) => setProvinces(res.data))
      .catch((err) => console.error("Error loading provinces:", err));
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
        "http://localhost:8080/driving-school-management/users/Add_Instructor",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Thêm giảng viên thành công!");
      setForm({
        username: "",
        passwordHash: "",
        email: "",
        firstName: "",
        lastName: "",
        gender: "Nam",
        provinceId: "",
        address: "",
        phoneNumber: "",
        certificationInfo: "",
        dateOfBirth: "", // reset ngày sinh
      });
      navigate("/users");
    } catch (error) {
      console.error(error);
      alert("Thêm giảng viên thất bại! Vui lòng kiểm tra lại username, email.");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Thêm Giảng Viên
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <TextField
          label="Tên đăng nhập"
          name="username"
          value={form.username}
          onChange={handleChange}
          required
        />
        <TextField
          label="Mật khẩu"
          name="passwordHash"
          value={form.passwordHash}
          onChange={handleChange}
          type="password"
          required
        />
        <TextField
          label="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
          type="email"
          required
        />
        <TextField
          label="Họ"
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
          required
        />
        <TextField
          label="Tên"
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
          required
        />

        {/* Gender */}
        <FormControl fullWidth>
          <InputLabel>Giới tính</InputLabel>
          <Select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            label="Giới tính"
          >
            <MenuItem value="Nam">Nam</MenuItem>
            <MenuItem value="Nữ">Nữ</MenuItem>
          </Select>
        </FormControl>

        {/* Date of Birth */}
        <TextField
          label="Ngày sinh"
          name="dateOfBirth"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={form.dateOfBirth}
          onChange={handleChange}
          required
        />

        {/* Province */}
        <FormControl fullWidth>
          <InputLabel>Tỉnh/Thành phố</InputLabel>
          <Select
            name="provinceId"
            value={form.provinceId}
            onChange={handleChange}
            label="Tỉnh/Thành phố"
            required
          >
            {provinces.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                {p.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Địa chỉ"
          name="address"
          value={form.address}
          onChange={handleChange}
          required
        />
        <TextField
          label="Số điện thoại"
          name="phoneNumber"
          value={form.phoneNumber}
          onChange={handleChange}
          required
        />

        {/* Certification */}
        <FormControl fullWidth>
          <InputLabel>Chứng chỉ</InputLabel>
          <Select
            name="certificationInfo"
            value={form.certificationInfo}
            onChange={handleChange}
          >
            <MenuItem value="Bằng lái hạng A1">Bằng lái hạng A1</MenuItem>
            <MenuItem value="Bằng lái hạng A2">Bằng lái hạng A2</MenuItem>
            <MenuItem value="Bằng lái hạng B1">Bằng lái hạng B1</MenuItem>
            <MenuItem value="Bằng lái hạng B2">Bằng lái hạng B2</MenuItem>
            <MenuItem value="Bằng lái hạng C">Bằng lái hạng C</MenuItem>
            <MenuItem value="Bằng lái hạng D">Bằng lái hạng D</MenuItem>
            <MenuItem value="Bằng lái hạng E">Bằng lái hạng E</MenuItem>
            <MenuItem value="Bằng lái hạng F">Bằng lái hạng F</MenuItem>
          </Select>
        </FormControl>

        <Button type="submit" variant="contained">
          Thêm Giảng Viên
        </Button>
      </Box>
    </Container>
  );
}
