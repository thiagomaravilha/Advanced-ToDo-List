import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Avatar, Typography, Box, AppBar, Toolbar, IconButton, Button } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

const drawerWidth = 260;

export const AppDrawer = ({ children }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const user = useTracker(() => Meteor.user());

  if (!user) return null;

  const profile = user.profile || {};
  // @ts-ignore
  const photo = profile.photo || '';
  // @ts-ignore
  const name = profile.name || user.username || '';
  const email = user.emails?.[0]?.address || '';

  const menuItems = [
    { text: 'Lista de Tarefas', icon: <AssignmentIcon />, path: '/tasks' },
    { text: 'Perfil', icon: <PersonIcon />, path: '/profile' },
  ];

  const handleNavigate = (path) => {
    navigate(path);
    setOpen(false);
  };

  const logout = () => Meteor.logout();

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: "linear-gradient(to bottom, #315481, #918e82 100%)"
        }}
        elevation={2}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              color="inherit"
              aria-label={open ? 'fechar menu' : 'abrir menu'}
              edge="start"
              onClick={() => setOpen((prev) => !prev)}
              sx={{ mr: 2 }}
            >
              {open ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              Advanced ToDo List
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#fff" }}>
              {name}
            </Typography>
            <Button
              color="inherit"
              onClick={logout}
              sx={{ textTransform: "none", fontWeight: "normal", fontSize: "1em", ml: 1 }}
              startIcon={<span role="img" aria-label="logout">🔓</span>}
            >
              Sair
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="temporary"
        open={open}
        onClose={() => setOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', zIndex: 1400 },
          zIndex: 1400
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            p: 3,
            bgcolor: 'primary.main',
            color: 'white',
          }}
        >
          <Avatar src={photo} sx={{ width: 80, height: 80, mb: 1, bgcolor: 'secondary.main' }}>
            {(!photo && name) ? name[0] : ''}
          </Avatar>
          <Typography variant="h6" noWrap>{name}</Typography>
          <Typography variant="body2" noWrap>{email}</Typography>
        </Box>
        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              selected={location.pathname === item.path}
              onClick={() => handleNavigate(item.path)}
            >
              <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: "100%",
          p: 2,
          pt: { xs: 7, sm: 8 },
          minHeight: "100vh",
          background: "rgba(255,255,255,0.96)"
        }}
      >
        {children}
      </Box>
    </Box>
  );
};