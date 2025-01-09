import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Bar, Pie } from 'react-chartjs-2';

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [categoriesData, setCategoriesData] = useState([]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await api.get('/transactions/');
      setTransactions(res.data);

      const categorySums = {};
      res.data.forEach((t) => {
        const cat = t.category ? t.category.name : 'Sem Categoria';
        if (!categorySums[cat]) categorySums[cat] = 0;
        if (t.transaction_type === 'expense') {
          categorySums[cat] += parseFloat(t.amount);
        }
      });

      const labels = Object.keys(categorySums);
      const values = Object.values(categorySums);

      setCategoriesData({
        labels,
        datasets: [
          {
            label: 'Despesas por Categoria',
            data: values,
            backgroundColor: [
              '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
            ],
          },
        ],
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Dashboard Financeiro</h2>
      <div style={{ width: '400px', margin: '0 auto' }}>
        {categoriesData && categoriesData.labels && (
          <Pie data={categoriesData} />
        )}
      </div>

      <h3>Transações Recentes</h3>
      <ul>
        {transactions.slice(0, 5).map((t) => (
          <li key={t.id}>
            {t.transaction_type.toUpperCase()} - {t.amount}€ - {t.category ? t.category.name : 'N/A'} ({t.date})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
