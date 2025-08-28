import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Paper, TextField, Box, IconButton, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { viVN } from "@mui/x-data-grid/locales";
import axios from "axios";
// Icons
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PeopleIcon from "@mui/icons-material/People";

export default function ClassTable() {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "className", headerName: "Tên Lớp", width: 200 },
    { field: "startDate", headerName: "Ngày Bắt Đầu", width: 150 },
    { field: "endDate", headerName: "Ngày Kết Thúc", width: 150 },
    { field: "maxStudents", headerName: "Sĩ Số Tối Đa", width: 120 },
    { field: "instructorName", headerName: "Giảng Viên", width: 150 },
    {
      field: "actions",
      headerName: "Sửa",
      width: 80,
      renderCell: (params) => (
        <Tooltip title="Sửa">
          <IconButton
            color="warning"
            size="small"
            onClick={() => navigate(`/classes/edit/${params.row.id}`)}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
      ),
    },
    {
      field: "view",
      headerName: "Chi Tiết",
      width: 80,
      renderCell: (params) => (
        <Tooltip title="Xem Chi Tiết">
          <IconButton
            color="primary"
            size="small"
            onClick={() => navigate(`/classes/${params.row.id}`)}
          >
            <VisibilityIcon />
          </IconButton>
        </Tooltip>
      ),
    },
    {
      field: "viewLearners",
      headerName: "Học Viên",
      width: 100,
      renderCell: (params) => (
        <Tooltip title="Xem Học Viên">
          <IconButton
            color="secondary"
            size="small"
            onClick={() => navigate(`/enrollments?classId=${params.row.id}`)}
          >
            <PeopleIcon />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("jwtToken");
      const res = await axios.get("http://localhost:8080/driving-school-management/classes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClasses(res.data);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách lớp học:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const filteredClasses = classes.filter((cls) =>
    cls.className.toLowerCase().includes(keyword.toLowerCase()) ||
    (cls.instructorName && cls.instructorName.toLowerCase().includes(keyword.toLowerCase()))
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
        rows={filteredClasses}
        columns={columns}
        pageSizeOptions={[5, 10, 20]}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        loading={loading}
        disableRowSelectionOnClick
        localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
      />
    </Paper>
  );
}