import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {Paper, TextField, Box, Tooltip, IconButton} from "@mui/material";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { viVN } from "@mui/x-data-grid/locales";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";

export default function ExamTable() {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "examName", headerName: "Tên kỳ thi", width: 200 },
    { 
      field: "examType", 
      headerName: "Loại kỳ thi", 
      width: 150,
      renderCell: (params) => {
        const typeMap = {
          'THEORY': 'Lý thuyết',
          'SIMULATION': 'Mô phỏng',
          'PRACTICAL': 'Thực hành',
          'ON_THE_ROAD': 'Đường trường'
        };
        return typeMap[params.value] || params.value;
      }
    },
    { field: "passScore", headerName: "Điểm đạt", width: 120 },
    {
      field: "actions",
      headerName: "Sửa",
      width: 80,
      renderCell: (params) => (
          <Tooltip title="Sửa">
            <IconButton
                color="warning"
                size="small"
                onClick={() => navigate(`/exams/edit/${params.row.id}`)}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
      ),
    }
  ];

  const fetchExams = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("jwtToken");
      const res = await axios.get("http://localhost:8080/driving-school-management/exams", 
        {
           headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      setExams(res.data);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách kỳ thi:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchExams();
  }, []);

  // Lọc kỳ thi theo từ khóa
  const filteredExams = exams.filter(exam =>
    exam.examName.toLowerCase().includes(keyword.toLowerCase()) ||
    exam.examType.toLowerCase().includes(keyword.toLowerCase())
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
        rows={filteredExams}
        columns={columns}
        pageSizeOptions={[10, 20]}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        loading={loading}
        disableRowSelectionOnClick
        localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
      />
    </Paper>
  );
}
