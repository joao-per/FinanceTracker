import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/token/', { username, password });
      localStorage.setItem('accessToken', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);
      navigate('/dashboard');
    } catch (error) {
      setErrorMsg('Credenciais inválidas ou erro no servidor.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-800 p-4">
      <div className="w-full max-w-md rounded-lg bg-white shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Iniciar Sessão
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <FontAwesomeIcon
              icon={faUser}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Utilizador"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
          </div>
          <div className="relative">
            <FontAwesomeIcon
              icon={faLock}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="password"
              placeholder="Palavra-passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition duration-300"
          >
            Entrar
          </button>
        </form>
        {errorMsg && (
          <p className="mt-4 text-sm text-center text-red-600">{errorMsg}</p>
        )}
        <p className="mt-6 text-center text-sm text-gray-600">
          Não tens conta?{' '}
          <a
            href="/register"
            className="text-indigo-600 hover:underline font-medium"
          >
            Regista-te aqui
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
