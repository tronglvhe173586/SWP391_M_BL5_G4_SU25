import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  Grid,
  Avatar,
  Divider,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

const LearnerProfilePage = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/driving-school-management/users/${id}/profile`
        );
        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProfile();
    }
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (!profile) {
    return <Typography color="error">Không tìm thấy dữ liệu người dùng</Typography>;
  }

  return (
    <Card
      sx={{
        maxWidth: 700,
        margin: "30px auto",
        borderRadius: 3,
        boxShadow: 5,
        p: 3,
      }}
    >
      <CardContent>
        {/* Header với avatar */}
        <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
          <Avatar sx={{ bgcolor: "primary.main", width: 80, height: 80, mb: 1 }}>
            <PersonIcon sx={{ fontSize: 50 }} />
          </Avatar>
          <Typography variant="h5" fontWeight="bold">
            Hồ sơ người dùng
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {profile.username} • {profile.email}
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Thông tin chung */}
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Họ tên
            </Typography>
            <Typography>
              {profile.firstName} {profile.lastName}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Giới tính
            </Typography>
            <Typography>{profile.gender}</Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Ngày sinh
            </Typography>
            <Typography>{profile.dateOfBirth}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Tỉnh/Thành
            </Typography>
            <Typography>{profile.province}</Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Nếu là Instructor */}
        {profile.employeeId ? (
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Mã nhân viên
              </Typography>
              <Typography>{profile.employeeId}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Ngày tuyển dụng
              </Typography>
              <Typography>{profile.hireDate}</Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Địa chỉ
              </Typography>
              <Typography>{profile.address}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Số điện thoại
              </Typography>
              <Typography>{profile.phoneNumber}</Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary">
                Chứng chỉ
              </Typography>
              <Typography>{profile.certificationInfo}</Typography>
            </Grid>
          </Grid>
        ) : (
          // Nếu là Learner
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Địa chỉ
              </Typography>
              <Typography>{profile.address}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Số điện thoại
              </Typography>
              <Typography>{profile.phoneNumber}</Typography>
            </Grid>
          </Grid>
        )}
      </CardContent>
    </Card>
  );
};

export default LearnerProfilePage;
