import React, { useState } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  TextField,
  Menu,
  MenuItem,
  Fab,
  Box,
  Checkbox,
  Button,
  Modal,
  Backdrop,
  Fade,
} from "@mui/material";

import AssignmentIcon from "@mui/icons-material/Assignment";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import EditIcon from "@mui/icons-material/Edit";
import LockIcon from "@mui/icons-material/Lock";

import { useNavigate } from "react-router-dom";

export const TaskForm = ({ tasks, onCheckboxClick, onDeleteClick }) => {
  const [text, setText] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text.trim()) return;

    await Meteor.callAsync("tasks.insert", {
      text: text.trim(),
      createdAt: new Date(),
      userId: Meteor.userId(),
      isPrivate,
    });

    setText("");
    setIsPrivate(false);
    setOpenModal(false);
  };

  const handleMenuOpen = (event, taskId) => {
    setAnchorEl(event.currentTarget);
    setSelectedTaskId(taskId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTaskId(null);
  };

  const handleEdit = () => {
    navigate(`/tasks/edit/${selectedTaskId}`);
    handleMenuClose();
  };

  const handleDelete = () => {
    const task = tasks.find((t) => t._id === selectedTaskId);
    if (task) {
      onDeleteClick(task);
    }
    handleMenuClose();
  };

  const getUserName = (userId) => {
    const user = Meteor.users.findOne(userId);
    return user ? user.username : "Usuário Desconhecido";
  };

  const formatTime = (date) => {
    const d = new Date(date);
    return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Concluída":
        return <CheckCircleIcon sx={{ color: "green", mr: 1 }} />;
      case "Em Andamento":
        return <AutorenewIcon sx={{ color: "blue", mr: 1 }} />;
      default:
        return <EditIcon sx={{ color: "gray", mr: 1 }} />;
    }
  };

  return (
    <Box sx={{ position: "relative", pb: 10 }}>
      {tasks.map((task) => (
        <Card key={task._id} sx={{ mb: 2, backgroundColor: "#ccc" }}>
          <CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <AssignmentIcon />
              <Box>
                <Typography variant="body1" sx={{ display: "flex", alignItems: "center" }}>
                  {getStatusIcon(task.status)}
                  <AccessTimeIcon fontSize="small" sx={{ mr: 0.5, verticalAlign: "middle" }} />
                  {formatTime(task.createdAt)} – {task.text}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {getUserName(task.userId)}
                  {task.isPrivate && (
                    <LockIcon fontSize="small" sx={{ color: "#444" }} titleAccess="Tarefa pessoal" />
                  )}
                </Typography>
              </Box>
            </Box>

            <IconButton onClick={(e) => handleMenuOpen(e, task._id)}>
              <MoreVertIcon />
            </IconButton>
          </CardContent>
        </Card>
      ))}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>Editar</MenuItem>
        <MenuItem onClick={handleDelete}>Remover</MenuItem>
      </Menu>

      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: "fixed", bottom: 80, right: 24 }}
        onClick={() => setOpenModal(true)}
      >
        <AddIcon />
      </Fab>


      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 300,
          },
        }}
      >
        <Fade in={openModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              borderRadius: 2,
              boxShadow: 24,
              p: 3,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Typography variant="h6" component="h2">
              Nova Tarefa
            </Typography>
            <TextField
              label="Nome da tarefa"
              value={text}
              onChange={(e) => setText(e.target.value)}
              fullWidth
            />
            <label>
              <Checkbox
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
              />
              Tarefa pessoal
            </label>
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
              <Button
                variant="outlined"
                onClick={() => {
                  setText("");
                  setIsPrivate(false);
                  setOpenModal(false);
                }}
              >
                Cancelar
              </Button>
              <Button variant="contained" onClick={handleSubmit}>
                Adicionar
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};
