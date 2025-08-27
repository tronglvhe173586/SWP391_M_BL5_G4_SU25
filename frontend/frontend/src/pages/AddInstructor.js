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

  const userRole = localStorage.getItem("userRole") || "ROLE_LEARNER";

  useEffect(() => {
    if (userRole !== "ROLE_ADMIN") {
      alert("Bạn không có quyền truy cập trang này.");
      navigate("/");
    }
  }, [userRole, navigate]);

  const [form, setForm] = useState({
    username: "",
    passwordHash: "",
    email: "",
    firstName: "",
    lastName: "",
    gender: "Nam",
    provinceId: "",
    address: "",
    phoneNumber: "",
    certificationInfo: "Bằng lái hạng A1",
    dateOfBirth: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    address: "",
  });

  const [provinces, setProvinces] = useState([]);

  // Lấy danh sách provinces từ backend
  useEffect(() => {
    axios
      .get("http://localhost:8080/driving-school-management/provinces")
      .then((res) => setProvinces(res.data))
      .catch((err) => console.error("Error loading provinces:", err));
  }, []);

  const validateField = (name, value) => {
    let errorMsg = "";

    if (name === "firstName" || name === "lastName") {
      if (!/^[\p{L}\s]+$/u.test(value)) {
        errorMsg = "Chỉ được nhập chữ cái";
      } else if (value.length > 20) {
        errorMsg = "Tối đa 20 ký tự";
      }
    }

    if (name === "username") {
      if (value.length > 30) errorMsg = "Tối đa 30 ký tự";
    }

    if (name === "email") {
      if (value.length > 50) errorMsg = "Tối đa 50 ký tự";
    }

    if (name === "address") {
      if (value.length > 255) errorMsg = "Tối đa 255 ký tự";
    }

    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Nếu còn lỗi thì không submit
    if (Object.values(errors).some((err) => err !== "")) {
      alert("Vui lòng sửa lỗi trước khi gửi!");
      return;
    }

    if (form.passwordHash.length < 8) {
      alert("Mật khẩu phải có ít nhất 8 ký tự!");
      return;
    }

    if (form.phoneNumber.length < 10 || form.phoneNumber.length > 11) {
      alert("Số điện thoại phải từ 10 đến 11 số.");
      return;
    }

    const today = new Date();
    const dob = new Date(form.dateOfBirth);
    const age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    const dayDiff = today.getDate() - dob.getDate();

    const isUnder18 =
      age < 18 ||
      (age === 18 && (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)));

    if (isUnder18) {
      alert("Người dùng phải đủ 18 tuổi trở lên!");
      return;
    }

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
        dateOfBirth: "",
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
          inputProps={{ maxLength: 30 }}
          error={!!errors.username}
          helperText={errors.username}
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
          inputProps={{ maxLength: 50 }}
          error={!!errors.email}
          helperText={errors.email}
        />
        <TextField
          label="Họ"
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
          required
          inputProps={{ maxLength: 20 }}
          error={!!errors.firstName}
          helperText={errors.firstName}
        />
        <TextField
          label="Tên"
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
          required
          inputProps={{ maxLength: 20 }}
          error={!!errors.lastName}
          helperText={errors.lastName}
        />

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

        <TextField
          label="Ngày sinh"
          name="dateOfBirth"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={form.dateOfBirth}
          onChange={handleChange}
          required
        />

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
          inputProps={{ maxLength: 255 }}
          error={!!errors.address}
          helperText={errors.address}
        />
        <TextField
          label="Số điện thoại"
          name="phoneNumber"
          value={form.phoneNumber}
          onChange={handleChange}
          required
        />

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
