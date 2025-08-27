import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const userRole = localStorage.getItem("userRole") || "ROLE_LEARNER";
  useEffect(() => {
    if (userRole !== "ROLE_ADMIN" && userRole !== "ROLE_INSTRUCTOR") {
      alert("Bạn không có quyền truy cập trang này.");
      navigate("/");
      return;
    }
  }, [userRole, navigate]);

  const [form, setForm] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    isActive: true,
  });

  const [errors, setErrors] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
  });

  const [loading, setLoading] = useState(true);

  // Lấy dữ liệu người dùng
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        const res = await axios.get(
          `http://localhost:8080/driving-school-management/users/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setForm({
          username: res.data.username,
          firstName: res.data.firstName,
          lastName: res.data.lastName,
          email: res.data.email,
          isActive: res.data.isActive,
        });

        setLoading(false);
      } catch (err) {
        console.error(err);
        alert("Không thể tải dữ liệu người dùng");
      }
    };
    fetchUser();
  }, [id]);

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
      if (value.length > 30) {
        errorMsg = "Tối đa 30 ký tự";
      }
    }
    if (name === "email") {
      if (value.length > 50) {
        errorMsg = "Tối đa 50 ký tự";
      }
    }
    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setForm((prev) => ({
      ...prev,
      [name]: val,
    }));
    validateField(name, val);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Nếu còn lỗi thì không submit
    if (Object.values(errors).some((err) => err !== "")) {
      alert("Vui lòng sửa lỗi trước khi cập nhật!");
      return;
    }

    try {
      const token = localStorage.getItem("jwtToken");
      await axios.put(
        `http://localhost:8080/driving-school-management/users/edit_User/${id}`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Cập nhật người dùng thành công!");
      navigate("/users");
    } catch (err) {
      console.error(err);
      alert("Email hoặc username đã tồn tại! Vui lòng kiểm tra lại.");
    }
  };

  if (loading) return <Typography>Đang tải dữ liệu người dùng...</Typography>;

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" mb={3}>
        Chỉnh sửa người dùng
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
          fullWidth
          required
          inputProps={{ maxLength: 30 }}
          error={!!errors.username}
          helperText={errors.username}
        />
        <TextField
          label="Họ"
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
          fullWidth
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
          fullWidth
          required
          inputProps={{ maxLength: 20 }}
          error={!!errors.lastName}
          helperText={errors.lastName}
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          fullWidth
          required
          inputProps={{ maxLength: 50 }}
          error={!!errors.email}
          helperText={errors.email}
        />
        <FormControlLabel
          control={
            <Checkbox
              name="isActive"
              checked={form.isActive}
              onChange={handleChange}
            />
          }
          label="Đang hoạt động"
        />
        <Button variant="contained" color="primary" type="submit">
          Cập nhật
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => navigate("/users")}
        >
          Hủy
        </Button>
      </Box>
    </Container>
  );
};

export default EditUser;
