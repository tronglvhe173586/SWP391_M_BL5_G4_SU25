import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { viVN } from "@mui/x-data-grid/locales";
import { Paper, TextField, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function UserTable() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "username", headerName: "Tên đăng nhập", width: 150 },
    { field: "firstName", headerName: "Họ", width: 150 },
    { field: "lastName", headerName: "Tên", width: 150 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "role", headerName: "Vai trò", width: 130 },
    {
      field: "isActive",
      headerName: "Hoạt động",
      width: 120,
      renderCell: (params) => (params.value ? "Có" : "Không"),
    },
    {
      field: "actions",
      headerName: "Hành động",
      width: 150,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="warning"
          size="small"
          onClick={() => navigate(`/users/edit/${params.row.id}`)}
        >
          Sửa
        </Button>
      ),
    },
    {
      field: "view",
      headerName: "Xem chi tiết",
      width: 150,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => navigate(`/users/${params.row.id}`)}
        >
          Xem
        </Button>
      ),
    },
  ];

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("jwtToken");
      const res = await axios.get(
        "http://localhost:8080/driving-school-management/users/users_pagination",
        {
          params: {
            page: page,
            size: pageSize,
            keyword: keyword,
          },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUsers(res.data.content || []);
      setTotalElements(res.data.totalElements || 0);
    } catch (err) {
      console.error("Lỗi khi tải danh sách người dùng:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, [page, pageSize, keyword]);

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
        rows={users}
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
