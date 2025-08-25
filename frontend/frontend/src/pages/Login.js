import React, { useState, useEffect } from "react";
import {
    Container,
    TextField,
    Button,
    Typography,
    Box,
    CircularProgress,
    Alert,
    Link
} from "@mui/material";
import { useNavigate, Link as RouterLink, useLocation } from "react-router-dom";
import { Google } from "@mui/icons-material";
import axios from "axios";
import { OAuthConfig } from "../configurations/configuration";
import { jwtDecode } from "jwt-decode";

import { setToken } from "../services/localStorageService";


export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();

    const [form, setForm] = useState({
        username: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        if (location.state?.successMessage) {
            setSuccessMessage(location.state.successMessage);
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage("");
        setSuccessMessage("");

        if (!form.username || !form.password) {
            setErrorMessage("Vui lòng điền đầy đủ tên đăng nhập và mật khẩu.");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:8080/driving-school-management/auth/token",
                {
                    username: form.username,
                    password: form.password
                }
            );

            console.log("Login response:", response.data);

            const token = response.data.result?.token;
            if (!token) throw new Error("Không tìm thấy token trong phản hồi.");

            setToken(token);

            const decodedToken = jwtDecode(token);
            const userRole = decodedToken.role;
            const userId = decodedToken.userId;
            
            // Store user information in localStorage
            localStorage.setItem('userRole', userRole);
            localStorage.setItem('userId', userId);
            
            if (userRole === "ROLE_ADMIN") {
                navigate("/users");
            } else if (userRole === "ROLE_LEARNER"){
                navigate("/my-exam-schedules");
            } else if (userRole === "ROLE_INSTRUCTOR") {
                navigate("/instructors");
            } else {
                navigate("/users");
            }
        } catch (error) {
            console.error("Login failed:", error);

            const message = error.response?.data?.message ||
                error.response?.data ||
                error.message ||
                "Đã xảy ra lỗi không xác định.";
            setErrorMessage(message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        const callbackUrl = OAuthConfig.redirectUri;
        const authUrl = OAuthConfig.authUri;
        const googleClientId = OAuthConfig.clientId;

        const targetUrl = `${authUrl}?redirect_uri=${encodeURIComponent(
            callbackUrl
        )}&response_type=code&client_id=${googleClientId}&scope=openid%20email%20profile`;

        window.location.href = targetUrl;
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Đăng nhập
            </Typography>

            {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
            {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}

            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
                <TextField
                    label="Username"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    required
                />
                <TextField
                    label="Password"
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                />
                <Button type="submit" variant="contained" disabled={loading}>
                    {loading ? <CircularProgress size={24} /> : "Đăng nhập"}
                </Button>

                <Button
                    variant="contained"
                    startIcon={<Google />}
                    onClick={handleGoogleLogin}
                    sx={{
                        backgroundColor: "#6a0dad",
                        "&:hover": { backgroundColor: "#5b0cb3" }
                    }}
                >
                    Đăng nhập bằng Google
                </Button>

                <div style={{ marginTop: "10px" }}>
                    <Link component={RouterLink} to="/forgot-password" underline="none" color="primary">
                        Quên mật khẩu?
                    </Link>
                </div>

                <div style={{ marginTop: "10px" }}>
                    Chưa có tài khoản?{" "}
                    <Link component={RouterLink} to="/register" underline="none" color="primary">
                        Đăng ký tại đây!
                    </Link>
                </div>
            </Box>
        </Container>
    );
}