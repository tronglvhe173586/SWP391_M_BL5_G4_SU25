import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Box,
  Alert,
} from "@mui/material";
import { useParams } from "react-router-dom";

const ClassListByCourse = () => {
  const { courseId } = useParams(); 
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const token = localStorage.getItem("jwtToken"); 
        const response = await axios.get(
          `http://localhost:8080/driving-school-management/courses/by-course/${courseId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setClasses(response.data);
      } catch (err) {
        console.error("Error fetching classes:", err);
        setError("Không thể tải danh sách lớp học.");
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, [courseId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom align="center">
        Danh sách lớp học của khóa ID: {courseId}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center"><b>Mã lớp</b></TableCell>
              <TableCell><b>Tên lớp</b></TableCell>
              <TableCell><b>Ngày bắt đầu</b></TableCell>
              <TableCell><b>Ngày kết thúc</b></TableCell>
              <TableCell align="center"><b>Sĩ số tối đa</b></TableCell>
              <TableCell><b>ID Giáo viên</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {classes.length > 0 ? (
              classes.map((cls) => (
                <TableRow key={cls.id}>
                  <TableCell align="center">{cls.id}</TableCell>
                  <TableCell>{cls.className}</TableCell>
                  <TableCell>
                    {cls.startDate
                      ? new Date(cls.startDate).toLocaleDateString("vi-VN")
                      : "Chưa có"}
                  </TableCell>
                  <TableCell>
                    {cls.endDate
                      ? new Date(cls.endDate).toLocaleDateString("vi-VN")
                      : "Chưa có"}
                  </TableCell>
                  <TableCell align="center">{cls.maxStudents}</TableCell>
                  <TableCell>{cls.instructorId || "Chưa phân công"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Không có lớp học nào cho khóa này
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ClassListByCourse;
