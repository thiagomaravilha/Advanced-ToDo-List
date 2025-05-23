import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTracker } from "meteor/react-meteor-data";
import { TasksCollection } from "/imports/api/TasksCollection";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
} from "@mui/material";
import { Meteor } from "meteor/meteor";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import ptBR from "date-fns/locale/pt-BR";

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
  const [date, setDate] = useState(null);

  useEffect(() => {
    if (task) {
      setName(task.text || "");
      setDescription(task.description || "");
      setStatus(task.status || "Cadastrada");
      setDate(task.createdAt ? new Date(task.createdAt) : new Date());
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
      createdAt: date,
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
    navigate("/tasks");
  };

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
  };

  if (!task) return <p>Carregando tarefa...</p>;

  return (
    <Box sx={{ maxWidth: 500, margin: "auto", mt: 4, p: 2 }}>
      <Typography variant="h6" align="center" gutterBottom>
        Editar tarefa: <strong>{task.text}</strong>
      </Typography>

      <Paper variant="outlined" sx={{ backgroundColor: "#ccc", p: 1, mb: 2 }}>
        <Typography variant="caption">Nome</Typography>
        <TextField
          variant="standard"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          InputProps={{
            disableUnderline: true,
            sx: { backgroundColor: "#ccc" },
          }}
        />
      </Paper>

      <Paper variant="outlined" sx={{ backgroundColor: "#ccc", p: 1, mb: 2 }}>
        <Typography variant="caption">Descrição</Typography>
        <TextField
          variant="standard"
          fullWidth
          multiline
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          InputProps={{
            disableUnderline: true,
            sx: { backgroundColor: "#ccc" },
          }}
        />
      </Paper>

      <Paper variant="outlined" sx={{ backgroundColor: "#ccc", p: 1, mb: 2 }}>
        <Typography variant="caption">Data</Typography>
        <LocalizationProvider dateAdapter={AdapterDateFns} 
          // @ts-ignore
          adapterLocale={ptBR}>
          <DateTimePicker
            value={date}
            onChange={(newValue) => setDate(newValue)}
            slotProps={{
              textField: {
                variant: "standard",
                fullWidth: true,
                InputProps: {
                  disableUnderline: true,
                  sx: { backgroundColor: "#ccc" },
                },
              },
            }}
          />
        </LocalizationProvider>
      </Paper>

      <Box display="flex" justifyContent="center" gap={1} flexWrap="wrap" mb={3}>
        <Button
          variant="outlined"
          onClick={() => handleStatusChange("Cadastrada")}
          disabled={status === "Cadastrada"}
        >
          Cadastrada
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
      </Box>

      <Box display="flex" justifyContent="center" gap={2}>
        <Button variant="outlined" onClick={cancelChanges}>
          Cancelar
        </Button>
        <Button variant="contained" onClick={saveChanges}>
          Salvar
        </Button>
      </Box>
    </Box>
  );
};
