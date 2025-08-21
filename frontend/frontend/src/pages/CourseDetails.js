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
  Chip,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import SchoolIcon from "@mui/icons-material/School";
import DescriptionIcon from "@mui/icons-material/Description";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CategoryIcon from "@mui/icons-material/Category";
import DeleteIcon from "@mui/icons-material/Delete";

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        const res = await axios.get(
          `http://localhost:8080/driving-school-management/courses/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setCourse(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        alert("Không thể tải dữ liệu khóa học");
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );

  if (!course) return <Typography align="center">Không tìm thấy khóa học</Typography>;

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Card sx={{ boxShadow: 3, borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom align="center">
            Thông tin Khóa học
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box display="flex" alignItems="center" gap={1}>
                <SchoolIcon color="primary" />
                <Typography>
                  <b>Tên khóa học:</b> {course.courseName}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box display="flex" alignItems="center" gap={1}>
                <CategoryIcon color="secondary" />
                <Typography>
                  <b>Loại khóa học:</b> {course.courseType}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box display="flex" alignItems="center" gap={1}>
                <DescriptionIcon color="action" />
                <Typography>
                  <b>Mô tả:</b> {course.description || "Không có"}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center" gap={1}>
                <AttachMoneyIcon color="success" />
                <Typography>
                  <b>Giá:</b> {course.price?.toLocaleString("vi-VN")} VND
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center" gap={1}>
                <AccessTimeIcon color="info" />
                <Typography>
                  <b>Thời lượng:</b> {course.duration} giờ
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box display="flex" alignItems="center" gap={1}>
                <DeleteIcon color={course.isDeleted ? "error" : "success"} />
                <Typography>
                  <b>Trạng thái:</b>{" "}
                  <Chip
                    label={course.isDeleted ? "Đã xóa" : "Hoạt động"}
                    color={course.isDeleted ? "error" : "success"}
                    size="small"
                  />
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Box mt={4} textAlign="center">
            <Button
              variant="contained"
              onClick={() => navigate("/courses")}
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
