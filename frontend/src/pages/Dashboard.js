import React, { useEffect, useState } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import api from '../services/api';

function Dashboard() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await api.get('/transactions/');
      setTransactions(res.data);
    } catch (error) {
      console.error('Erro ao buscar transações:', error);
    }
  };

  // Agrupar despesas por categoria
  const expenseData = {};
  // Agrupar rendimentos por categoria
  const incomeData = {};

  transactions.forEach((t) => {
    if (!t.category) return;
    const catName = t.category.name;
    if (t.transaction_type === 'expense') {
      expenseData[catName] = (expenseData[catName] || 0) + parseFloat(t.amount);
    } else {
      incomeData[catName] = (incomeData[catName] || 0) + parseFloat(t.amount);
    }
  });

  const expenseLabels = Object.keys(expenseData);
  const expenseValues = Object.values(expenseData);
  const incomeLabels = Object.keys(incomeData);
  const incomeValues = Object.values(incomeData);

  return (
    <div className="container fade-in">
      <h2>Dashboard Financeiro</h2>
      <div className="chart-container">
        <h3>Despesas por Categoria</h3>
        <Pie
          data={{
            labels: expenseLabels,
            datasets: [
              {
                data: expenseValues,
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#9966FF', '#FF9F40'],
              },
            ],
          }}
          options={{ responsive: true }}
        />
      </div>
      <div className="chart-container">
        <h3>Rendimentos por Categoria</h3>
        <Pie
          data={{
            labels: incomeLabels,
            datasets: [
              {
                data: incomeValues,
                backgroundColor: ['#4BC0C0', '#FF6384', '#36A2EB', '#FFCE56', '#9966FF'],
              },
            ],
          }}
          options={{ responsive: true }}
        />
      </div>
    </div>
  );
}

export default Dashboard;
