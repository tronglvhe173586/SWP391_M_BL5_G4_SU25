import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { viVN } from "@mui/x-data-grid/locales";
import { Paper, TextField, Box, IconButton, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Icons
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SchoolIcon from "@mui/icons-material/School";

export default function CourseTable() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "courseName", headerName: "Tên khóa học", width: 200 },
    { field: "courseType", headerName: "Loại khóa học", width: 120 },
    { field: "description", headerName: "Mô tả", width: 250 },
    { field: "price", headerName: "Giá", width: 120 },
    { field: "duration", headerName: "Thời lượng", width: 90 },
    {
      field: "isDeleted",
      headerName: "Đã xóa",
      width: 90,
      renderCell: (params) => (params.value ? "Có" : "Không"),
    },
    {
      field: "actions",
      headerName: "Sửa",
      width: 80,
      renderCell: (params) => (
        <Tooltip title="Sửa">
          <IconButton
            color="warning"
            size="small"
            onClick={() => navigate(`/courses/edit/${params.row.id}`)}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
      ),
    },
    {
      field: "view",
      headerName: "Chi tiết",
      width: 80,
      renderCell: (params) => (
        <Tooltip title="Xem chi tiết">
          <IconButton
            color="primary"
            size="small"
            onClick={() => navigate(`/courses/${params.row.id}`)}
          >
            <VisibilityIcon />
          </IconButton>
        </Tooltip>
      ),
    },
    {
      field: "viewClasses",
      headerName: "Lớp học",
      width: 100,
      renderCell: (params) => (
        <Tooltip title="Xem lớp học">
          <IconButton
            color="secondary"
            size="small"
            onClick={() => navigate(`/courses/${params.row.id}/classes`)}
          >
            <SchoolIcon />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("jwtToken");
      const res = await axios.get(
        "http://localhost:8080/driving-school-management/courses/courses_pagination",
        {
          params: {
            page: page,
            size: pageSize,
            keyword: keyword,
          },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCourses(res.data.content || []);
      setTotalElements(res.data.totalElements || 0);
    } catch (err) {
      console.error("Lỗi khi tải danh sách khóa học:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCourses();
  }, [page, pageSize, keyword]);

  return (
    <Paper sx={{ height: 600, width: "100%" }}>
      <Box sx={{ p: 2 }}>
        <TextField
          label="Tìm kiếm theo tên khóa học"
          variant="outlined"
          size="small"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          fullWidth
        />
      </Box>
      <DataGrid
        rows={courses}
        columns={columns}
        paginationMode="server"
        rowCount={totalElements}
        pageSizeOptions={[10, 20, 50]}
        paginationModel={{ page, pageSize }}
        onPaginationModelChange={(model) => {
          setPage(model.page);
          setPageSize(model.pageSize);
        }}
        loading={loading}
        disableRowSelectionOnClick
        localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
      />
    </Paper>
  );
}
