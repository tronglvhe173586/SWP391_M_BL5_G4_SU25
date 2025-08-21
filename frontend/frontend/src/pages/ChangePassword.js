import React, { useState } from "react";
import {
    Container, TextField, Button, Typography, Box,
    CircularProgress, Alert
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

export default function ChangePassword() {
    const navigate = useNavigate();
    const location = useLocation();
    const { email, otp } = location.state || {};

    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage("");

        if (!email || !otp) {
            setErrorMessage("Không thể thay đổi mật khẩu.");
            setLoading(false);
            return;
        }

        if (password !== repeatPassword) {
            setErrorMessage("Mật khẩu không khớp. Vui lòng thử lại.");
            setLoading(false);
            return;
        }

        try {
            await axios.post(`/driving-school-management/forgot-password/change-password/${email}`, {
                password,
                repeatPassword
            });
            navigate("/login");
        } catch (error) {
            console.error(error);
            setErrorMessage(error.response?.data || "Đã xảy ra lỗi khi thay đổi mật khẩu.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Thay đổi mật khẩu
            </Typography>

            {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}

            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
                <TextField
                    label="Mật khẩu mới"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <TextField
                    label="Nhập lại mật khẩu"
                    name="repeatPassword"
                    type="password"
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                    required
                />
                <Button type="submit" variant="contained" disabled={loading}>
                    {loading ? <CircularProgress size={24} /> : "Thay đổi mật khẩu"}
                </Button>
            </Box>
        </Container>
    );
}