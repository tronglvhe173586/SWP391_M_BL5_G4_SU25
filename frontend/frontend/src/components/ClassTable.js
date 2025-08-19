import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Paper, TextField, Box } from "@mui/material";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { viVN } from "@mui/x-data-grid/locales";
import axios from "axios";

export default function ClassTable() {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "className", headerName: "Tên Lớp", width: 200 },
    {
      field: "startDate",
      headerName: "Ngày Bắt Đầu",
      width: 150,
    },
    {
      field: "endDate",
      headerName: "Ngày Kết Thúc",
      width: 150,
    },
    { field: "maxStudents", headerName: "Sĩ Số Tối Đa", width: 120 },
    { field: "instructorName", headerName: "Giảng Viên", width: 150 },
    {
      field: "actions",
      headerName: "Hành Động",
      width: 150,
      renderCell: (params) => (
        <>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => navigate(`/classes/${params.row.id}`)}
            style={{ marginRight: "10px" }}
          >
            Xem
          </Button>
          <Button
            variant="contained"
            color="warning"
            size="small"
            onClick={() => navigate(`/classes/edit/${params.row.id}`)}
          >
            Sửa
          </Button>
        </>
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