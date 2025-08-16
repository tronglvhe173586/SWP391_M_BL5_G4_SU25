import React, { useState, useEffect } from "react";
import {
  Container,
  Button,
  Typography,
  Box,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  Chip
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import WorkIcon from "@mui/icons-material/Work";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";

export default function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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

        setUser({
          username: res.data.username,
          fullName: res.data.fullName,
          email: res.data.email,
          role: res.data.role,
          isActive: res.data.isActive,
          createdAt: res.data.createdAt,
          updatedAt: res.data.updatedAt,
        });

        setLoading(false);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch user data");
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );

  if (!user) return <Typography align="center">Không tìm thấy user</Typography>;

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Card sx={{ boxShadow: 3, borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom align="center">
            Thông tin User
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box display="flex" alignItems="center" gap={1}>
                <PersonIcon color="primary" />
                <Typography><b>Tên tài khoản:</b> {user.username}</Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box display="flex" alignItems="center" gap={1}>
                <PersonIcon color="secondary" />
                <Typography><b>Họ tên:</b> {user.fullName}</Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box display="flex" alignItems="center" gap={1}>
                <EmailIcon color="action" />
                <Typography><b>Email:</b> {user.email}</Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box display="flex" alignItems="center" gap={1}>
                <WorkIcon color="success" />
                <Typography><b>Vai trò:</b> {user.role}</Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box display="flex" alignItems="center" gap={1}>
                <VerifiedUserIcon color={user.isActive ? "success" : "error"} />
                <Typography>
                  <b>Trạng thái:</b>{" "}
                  <Chip
                    label={user.isActive ? "Hoạt động" : "Không hoạt động"}
                    color={user.isActive ? "success" : "error"}
                    size="small"
                  />
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Box mt={4} textAlign="center">
            <Button
              variant="contained"
              onClick={() => navigate("/users")}
              sx={{ borderRadius: 2 }}
            >
              Quay lại danh sách
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
