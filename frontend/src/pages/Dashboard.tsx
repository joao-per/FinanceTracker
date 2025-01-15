// Dashboard.tsx
import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import api from '../services/api';
import '../css/style.css';

// Registar manualmente os componentes que precisas
ChartJS.register(ArcElement, Tooltip, Legend, Title);

function Dashboard() {
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await api.get('/transactions/');
      setTransactions(response.data);
    } catch (error) {
      console.error('Erro ao buscar transações:', error);
      // Se receber 401, podes redirecionar para login
    }
  };

  // ... processas as transações para gerar datasets ...
  const expenseData = {
    labels: ['Exemplo 1', 'Exemplo 2'],
    datasets: [
      {
        data: [30, 70],
        backgroundColor: ['#FF6384', '#36A2EB'],
      },
    ],
  };

  return (
    <div className="container mx-auto p-4 fade-in">
      <h2 className="text-2xl font-bold mb-4">Dashboard Financeiro</h2>
      <div className="bg-white p-4 rounded shadow-md">
        <h3 className="text-xl mb-2">Despesas por Categoria</h3>
        <Pie data={expenseData} />
      </div>
    </div>
  );
}

export default Dashboard;
