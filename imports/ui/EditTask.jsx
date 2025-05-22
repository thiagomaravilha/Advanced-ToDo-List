import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTracker } from "meteor/react-meteor-data";
import { TasksCollection } from "/imports/api/TasksCollection";
import { Box, Typography, TextField, Button } from "@mui/material";
import { Meteor } from "meteor/meteor";
import "/client/EditTask.css";

export const EditTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  useTracker(() => {
    Meteor.subscribe("tasks");
  }, []);

  const task = useTracker(() => TasksCollection.findOne(id), [id]);
  const currentUserId = Meteor.userId();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");

  const [originalName, setOriginalName] = useState("");
  const [originalDescription, setOriginalDescription] = useState("");
  const [originalStatus, setOriginalStatus] = useState("");

  useEffect(() => {
    if (task) {
      setName(task.text || "");
      setDescription(task.description || "");
      setStatus(task.status || "Cadastrada");

      setOriginalName(task.text || "");
      setOriginalDescription(task.description || "");
      setOriginalStatus(task.status || "Cadastrada");
    }
  }, [task]);

  useEffect(() => {
    if (task && task.userId !== currentUserId) {
      alert("Você não tem permissão para editar esta tarefa.");
      navigate("/tasks");
    }
  }, [task, currentUserId, navigate]);

  const saveChanges = () => {
    if (!name.trim()) {
      alert("O nome da tarefa não pode estar vazio.");
      return;
    }

    Meteor.call("tasks.update", {
      _id: id,
      name,
      description,
      status,
    }, (err) => {
      if (err) {
        alert(err.reason || "Erro ao salvar alterações.");
      } else {
        alert("Alterações salvas com sucesso!");
        navigate("/tasks");
      }
    });
  };

  const cancelChanges = () => {
    setName(originalName);
    setDescription(originalDescription);
    setStatus(originalStatus);
    navigate("/tasks");
  };

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
  };

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

  if (!task) return <p>Carregando tarefa...</p>;

  return (
    <Box className="edit-task-container" sx={{ maxWidth: 600, margin: "auto", p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Editar Tarefa
      </Typography>

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

      <Typography variant="body2" gutterBottom>
        Status: {status}
      </Typography>
      <Typography variant="body2" gutterBottom>
        Data de criação: {formatDate(task.createdAt)}
      </Typography>
      <Typography variant="caption" display="block" gutterBottom>
        Criado por: {getUserName(task.userId)}
      </Typography>

      <Box mt={2} display="flex" gap={1} flexWrap="wrap">
        <Button variant="contained" onClick={saveChanges}>
          Salvar
        </Button>
        <Button
          variant="outlined"
          onClick={() => handleStatusChange("Em Andamento")}
          disabled={status !== "Cadastrada"}
        >
          Iniciar
        </Button>
        <Button
          variant="outlined"
          onClick={() => handleStatusChange("Concluída")}
          disabled={status !== "Em Andamento"}
        >
          Concluir
        </Button>
        <Button
          variant="outlined"
          onClick={() => handleStatusChange("Cadastrada")}
          disabled={status === "Cadastrada"}
        >
          Voltar para Cadastrada
        </Button>
        <Button variant="text" onClick={cancelChanges}>
          Cancelar
        </Button>
      </Box>
    </Box>
  );
};
