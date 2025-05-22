import React from "react";
import { useNavigate } from "react-router-dom";
import { useTracker } from "meteor/react-meteor-data";
import { TasksCollection } from "/imports/api/TasksCollection";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import { Meteor } from "meteor/meteor";
import '/client/welcome-screen.css';

export const WelcomeScreen = () => {
  const navigate = useNavigate();
  const user = useTracker(() => Meteor.user());

  const { total, concluidas, pendentes } = useTracker(() => {
    const tasks = TasksCollection.find().fetch();
    const total = tasks.length;
    const concluidas = tasks.filter((t) => t.status === "Concluída").length;
    const pendentes = tasks.filter(
      (t) => t.status === "Cadastrada" || t.status === "Em Andamento"
    ).length;
    return { total, concluidas, pendentes };
  });

  const CardBox = ({ title, value, onClick }) => (
    <Card
      sx={{
        backgroundColor: "#ccc",
        width: 200,
        height: 150,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 2,
        cursor: onClick ? "pointer" : "default",
        transition: "transform 0.2s",
        '&:hover': {
          transform: onClick ? "scale(1.03)" : "none",
        },
        textAlign: "center",
      }}
      onClick={onClick}
    >
      {title !== "Visualizar Tarefas" && (
        <Typography variant="body2" sx={{ fontSize: "14px", mb: 1 }}>
          {title}
        </Typography>
      )}
      {value ? (
        <Typography variant="h2" sx={{ fontWeight: "bold" }}>
          {value}
        </Typography>
      ) : (
        <Typography variant="h5" sx={{ fontWeight: "bold", whiteSpace: "pre-line" }}>
          {title === "Visualizar Tarefas" ? "Visualizar\nTarefas" : ""}
        </Typography>
      )}
    </Card>
  );

  return (
    <Box sx={{ p: 4, textAlign: "center" }}>
      <Typography variant="h5" gutterBottom>
        Olá {user?.profile?.name || user?.username || "Usuário"}, seja bem vindo ao Todo List
      </Typography>

      <Grid
        container
        spacing={4}
        justifyContent="center"
        alignItems="center"
        mt={2}
      >
        <Grid item>
          <CardBox title="Total de tarefas cadastradas" value={total} onClick={undefined} />
        </Grid>
        <Grid item>
          <CardBox title="Total de tarefas concluídas" value={concluidas} onClick={undefined} />
        </Grid>
        <Grid item>
          <CardBox title="Total de tarefas a serem concluídas" value={pendentes} onClick={undefined} />
        </Grid>
        <Grid item>
          <CardBox
            title="Visualizar Tarefas"
            onClick={() => navigate("/tasks")} value={undefined}          />
        </Grid>
      </Grid>
    </Box>
  );
};
