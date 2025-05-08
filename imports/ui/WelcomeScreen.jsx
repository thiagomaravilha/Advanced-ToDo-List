import React from 'react';
import { useNavigate } from 'react-router-dom';

export const WelcomeScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="welcome-screen">
      <h1>Bem-vindo!</h1>
      <p>Você está autenticado. Clique no botão abaixo para acessar suas tarefas.</p>
      <button onClick={() => navigate('/tasks')}>Ver Tarefas</button>
    </div>
  );
};