import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getToken, removeToken } from '../services/localStorageService';
import { decodeToken } from '../helpers/jwtDecode';   

const pages = [
  { name: 'Tài Khoản', path: '/users' },
  { name: 'Khóa Học', path: '/courses' },
  { name: 'Bài Thi', path: '/exams' },
  { name: 'Lịch Thi', path: '/exam-schedules' },
  { name: 'Lớp học', path: '/classes' },
  { name: 'Đăng ký thi', path: '/exam-registration' },
  { name: 'Quản lý đăng ký thi', path: '/exam-registration-management' },
];

const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

function ResponsiveAppBar() {
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  // 🔑 lấy userId từ token
  const token = getToken();
  const decoded = decodeToken(token);
  const userId = decoded?.userId; // key này đúng với token bạn gửi ở trên

  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  const handleLogout = async () => {
    try {
      if (token) {
        await axios.post('/driving-school-management/auth/logout', { token });
      }
    } catch (e) {
      // ignore
    } finally {
      removeToken();
      navigate('/login');
    }
  };

  const handleSettingClick = (setting) => {
  handleCloseUserMenu();
  if (setting === 'Logout') {
    handleLogout();
  } else if (setting === 'Profile' && userId) {
    navigate(`/users/${userId}/profile`);
  }
};


  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Driving School
          </Typography>

          {/* Menu mobile */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton size="large" onClick={handleOpenNavMenu} color="inherit">
              <MenuIcon />
            </IconButton>
            <Menu anchorEl={anchorElNav} open={Boolean(anchorElNav)} onClose={handleCloseNavMenu}>
              {pages.map((page) => (
                <MenuItem key={page.name} component={Link} to={page.path} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Menu desktop */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page.name}
                component={Link}
                to={page.path}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page.name}
              </Button>
            ))}
          </Box>

          {/* Avatar user */}
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="User" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              anchorEl={anchorElUser}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={() => handleSettingClick(setting)}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
