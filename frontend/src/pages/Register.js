import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post('/register/', { username, email, password });
      // Registo ok; redirecionar para login
      navigate('/');
    } catch (error) {
      setErrorMsg('Erro ao registar utilizador. ' + error.response?.data?.error);
    }
  };

  return (
    <div className="auth-container fade-in">
      <h2>Registar Conta</h2>
      <form onSubmit={handleRegister} className="auth-form">
        <input
          type="text"
          placeholder="Utilizador"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Palavra-passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Registar</button>
      </form>
      {errorMsg && <p className="error-message">{errorMsg}</p>}
      <p>
        Já tens conta? <a href="/">Inicia sessão</a>
      </p>
    </div>
  );
}

export default Register;
