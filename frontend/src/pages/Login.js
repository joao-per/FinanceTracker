import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login/', { username, password });
      localStorage.setItem('authToken', response.data.token); 
      navigate('/dashboard');
    } catch (error) {
      alert('Erro no login!');
    }
  };

  return (
    <div className="login-container">
      <h1>Iniciar Sessão</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome de utilizador"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Palavra-passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}

export default Login;
