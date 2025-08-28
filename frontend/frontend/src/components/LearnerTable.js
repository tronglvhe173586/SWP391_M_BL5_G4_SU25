import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Paper, TextField, Box, IconButton, Tooltip, Snackbar, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { viVN } from "@mui/x-data-grid/locales";
import axios from "axios";
// Icons
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";

export default function LearnerTable({ classId }) {
  const navigate = useNavigate();
  const [learners, setLearners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [error, setError] = useState(null);

  const statusTranslations = {
    ENROLLED: "Đã Đăng Ký",
    DROPPED: "Đã Rút",
    COMPLETED: "Đã Hoàn Thành",
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "learnerName", headerName: "Tên Học Viên", width: 200 },
    { field: "className", headerName: "Tên Lớp", width: 200 },
    { field: "enrollmentDate", headerName: "Ngày Đăng Ký", width: 150 },
    {
      field: "status",
      headerName: "Trạng Thái",
      width: 120,
      renderCell: (params) => statusTranslations[params.value] || params.value,
    },
    {
      field: "actions",
      headerName: "Hành Động",
      width: 150,
      renderCell: (params) => (
        <>
          <Tooltip title="Xem Chi Tiết">
            <IconButton
              color="primary"
              size="small"
              onClick={() => navigate(`/enrollments/${params.row.id}?classId=${classId}`)}
            >
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Sửa">
            <IconButton
              color="warning"
              size="small"
              onClick={() => navigate(`/enrollments/edit/${params.row.id}?classId=${classId}`)}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  const fetchLearners = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("jwtToken");
      const params = classId ? { classId } : {};
      const res = await axios.get("http://localhost:8080/driving-school-management/enrollments", {
        params,
        headers: { Authorization: `Bearer ${token}` },
      });
      setLearners(res.data);
      setError(null);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách học viên:", err);
      setError(`Lỗi khi lấy danh sách học viên: ${err.response?.data?.message || err.message}`);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLearners();
  }, [classId]);

  const filteredLearners = learners.filter((learner) =>
    (learner.learnerName.toLowerCase().includes(keyword.toLowerCase()) ||
     learner.className.toLowerCase().includes(keyword.toLowerCase()))
  );

  return (
    <Paper sx={{ height: 500, width: "100%" }}>
      <Box sx={{ p: 2 }}>
        <TextField
          label="Tìm kiếm"
          variant="outlined"
          size="small"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          fullWidth
        />
      </Box>
      <DataGrid
        rows={filteredLearners}
        columns={columns}
        pageSizeOptions={[10, 20, 50]}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        loading={loading}
        disableRowSelectionOnClick
        localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
      />
      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>
    </Paper>
  );
}