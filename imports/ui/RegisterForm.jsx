import { Accounts } from 'meteor/accounts-base';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '/client/register-form.css';

export const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Preencha todos os campos.');
      return;
    }
    if (password !== confirm) {
      setError('As senhas não coincidem.');
      return;
    }
    Accounts.createUser({ username, password }, (err) => {
      if (err) {
        // @ts-ignore
        setError(err.reason || 'Erro ao criar conta.');
      } else {
        setError('');
        navigate('/');
      }
    });
  };

  return (
    <div className="register-form-container">
      <form onSubmit={submit} className="register-form">
        {error && <p className="error-message">{error}</p>}

        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            placeholder="Username"
            name="username"
            required
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
          />
        </div>

        <div>
          <label htmlFor="password">Senha</label>
          <input
            type="password"
            placeholder="Senha"
            name="password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="confirm">Confirmar Senha</label>
          <input
            type="password"
            placeholder="Confirmar Senha"
            name="confirm"
            required
            onChange={(e) => setConfirm(e.target.value)}
          />
        </div>

        <div>
          <button type="submit">Cadastrar</button>
        </div>

        <div>
          <Link to="/" className="register-link">
            Já tem uma conta? Entrar
          </Link>
        </div>
      </form>
    </div>
  );
};
