import React, { useState } from "react";
import {Container, TextField, Button, Typography, Box, CircularProgress, Alert, Link} from "@mui/material";
import { useNavigate , Link as RouterLink} from "react-router-dom";
import axios from "axios";


export default function Login() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        username: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

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

        try {
            const response = await axios.post(
                "/driving-school-management/auth/token", // dùng proxy từ package.json
                {
                    username: form.username,
                    password: form.password
                }
            );

            console.log("Login response:", response.data);

            const token = response.data.result?.token;
            if (!token) throw new Error("Token not found in response");

            localStorage.setItem("jwtToken", token);
            navigate("/users");
        } catch (error) {
            console.error(error);
            if (error.response && error.response.data) {
                setErrorMessage(error.response.data.message || JSON.stringify(error.response.data));
            } else {
                setErrorMessage(error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Đăng nhập
            </Typography>

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