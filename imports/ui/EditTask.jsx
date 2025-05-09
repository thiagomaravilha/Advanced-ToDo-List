import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTracker } from "meteor/react-meteor-data";
import { TasksCollection } from "/imports/api/TasksCollection";
import { Box, Typography, TextField, MenuItem, Button } from "@mui/material";
import { Meteor } from "meteor/meteor";

import "/client/EditTask.css";

export const EditTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  useTracker(() => {
    Meteor.subscribe("tasks");
    Meteor.subscribe("userData"); 
  }, []);

  const task = useTracker(() => TasksCollection.findOne(id), [id]);

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(task?.text || "");
  const [description, setDescription] = useState(task?.description || "");
  const [status, setStatus] = useState(task?.status || "Cadastrada");

  const getUserName = (userId) => {
    const user = Meteor.users.findOne(userId);
    return user?.username || "Usuário Desconhecido";
  };

  const formatDate = (date) => {
    if (!date) return "Data não disponível";
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const saveChanges = () => {
    Meteor.call("tasks.update", { _id: id, name, description, status }, (err) => {
      if (!err) {
        setIsEditing(false);
      }
    });
  };

  const handleStatusChange = (newStatus) => {
    Meteor.call("tasks.update", { _id: id, name, description, status: newStatus });
  };

  if (!task) return <p>Carregando tarefa...</p>;

  return (
    <Box className="edit-task-container" sx={{ maxWidth: 600, margin: "auto", p: 2 }}>
      {!isEditing ? (
        <>
          <Typography variant="h4" gutterBottom>{task.text}</Typography>
          <Typography variant="body1" gutterBottom>{task.description || "Sem descrição"}</Typography>
          <Typography variant="body2" gutterBottom>Status: {task.status}</Typography>
          <Typography variant="body2" gutterBottom>Data de criação: {formatDate(task.createdAt)}</Typography>
          <Typography variant="caption" display="block" gutterBottom>
            Criado por: {getUserName(task.userId)}
          </Typography>

          <Box mt={2} display="flex" gap={1} flexWrap="wrap">
            <Button variant="contained" onClick={() => setIsEditing(true)}>Editar</Button>

            <Button
              variant="outlined"
              onClick={() => handleStatusChange("Em Andamento")}
              disabled={task.status !== "Cadastrada"}
            >
              Iniciar
            </Button>

            <Button
              variant="outlined"
              onClick={() => handleStatusChange("Concluída")}
              disabled={task.status !== "Em Andamento"}
            >
              Concluir
            </Button>

            <Button
              variant="outlined"
              onClick={() => handleStatusChange("Cadastrada")}
              disabled={task.status === "Cadastrada"}
            >
              Voltar para Cadastrada
            </Button>

            <Button
              variant="text"
              onClick={() => navigate("/tasks")}
              sx={{ ml: "auto" }}
            >
              Voltar
            </Button>
          </Box>
        </>
      ) : (
        <>
          <Typography variant="h5" gutterBottom>Editar Tarefa</Typography>
          <TextField
            label="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Descrição"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            margin="normal"
            multiline
            rows={4}
          />
          <TextField
            select
            label="Situação"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            fullWidth
            margin="normal"
          >
            <MenuItem value="Cadastrada">Cadastrada</MenuItem>
            <MenuItem value="Em Andamento">Em Andamento</MenuItem>
            <MenuItem value="Concluída">Concluída</MenuItem>
          </TextField>

          <Box mt={2} display="flex" gap={2}>
            <Button variant="contained" color="primary" onClick={saveChanges}>
              Salvar
            </Button>
            <Button variant="outlined" onClick={() => setIsEditing(false)}>
              Cancelar
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};
