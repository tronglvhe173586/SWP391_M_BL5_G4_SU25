import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { setToken } from "../services/localStorageService";
import { Box, CircularProgress, Typography } from "@mui/material";
import { jwtDecode } from "jwt-decode";

export default function Authenticate() {
    const navigate = useNavigate();
    const [isLoggedin, setIsLoggedin] = useState(false);

    useEffect(() => {
        console.log(window.location.href);

        const authCodeRegex = /code=([^&]+)/;
        const isMatch = window.location.href.match(authCodeRegex);

        if (isMatch) {
            const authCode = isMatch[1];

            fetch(
                `http://localhost:8080/driving-school-management/auth/outbound/authentication?code=${authCode}`,
                {
                    method: "POST",
                }
            )
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    console.log(data);

                    setToken(data.result?.token);
                    
                    // Decode token to get user information
                    if (data.result?.token) {
                        const decodedToken = jwtDecode(data.result.token);
                        const userRole = decodedToken.role;
                        const userId = decodedToken.userId;
                        
                        // Store user information in localStorage
                        localStorage.setItem('userRole', userRole);
                        localStorage.setItem('userId', userId);
                    }
                    
                    setIsLoggedin(true);
                });
        }
    }, []);

    useEffect(() => {
        if (isLoggedin) {
            const userRole = localStorage.getItem('userRole');
            if (userRole === "ROLE_ADMIN") {
                navigate("/users");
            } else if (userRole === "ROLE_LEARNER") {
                navigate("/my-exam-schedules");
            } else if (userRole === "ROLE_INSTRUCTOR") {
                navigate("/instructors");
            } else {
                navigate("/users");
            }
        }
    }, [isLoggedin, navigate]);

    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "30px",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                }}
            >
                <CircularProgress></CircularProgress>
                <Typography>Authenticating...</Typography>
            </Box>
        </>
    );
}