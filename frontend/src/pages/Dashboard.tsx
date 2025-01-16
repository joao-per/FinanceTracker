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

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await api.get('/transactions/');
      setTransactions(response.data);
    } catch (error) {
      console.error('Erro ao buscar transações:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const expenseData = {
    labels: ['Alimentação', 'Transporte', 'Lazer', 'Outros'],
    datasets: [
      {
        data: [30, 25, 20, 25],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
      },
    ],
  };

  return (
    <div className="container mx-auto p-4 fade-in">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Dashboard Financeiro
      </h2>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">
            Despesas por Categoria
          </h3>
          <Pie data={expenseData} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
