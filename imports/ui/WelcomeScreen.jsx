import React from 'react';
import { useNavigate } from 'react-router-dom';

export const WelcomeScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="welcome-screen">
      <h1>Bem-vindo!</h1>
      <p>Você está autenticado. Clique nos botões abaixo:</p>
      <button onClick={() => navigate('/tasks')}>Ver Tarefas</button>
      <button onClick={() => navigate('/profile')}>Perfil</button>
    </div>
  );
};