import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTracker } from "meteor/react-meteor-data";
import {
  Box,
  Typography,
  Card,
  Grid,
} from "@mui/material";
import { Meteor } from "meteor/meteor";
import '/client/welcome-screen.css';

export const WelcomeScreen = () => {
  const navigate = useNavigate();
  const user = useTracker(() => Meteor.user());

  const [stats, setStats] = useState({ total: 0, concluidas: 0, pendentes: 0 });

  useEffect(() => {
    Meteor.call("tasks.getStats", (error, result) => {
      if (!error && result) {
        setStats(result);
      } else {
        console.error("Erro ao buscar estatísticas:", error);
      }
    });
  }, []);

  const { total, concluidas, pendentes } = stats;

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
      {value !== undefined ? (
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
