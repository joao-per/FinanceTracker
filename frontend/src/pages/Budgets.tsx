// Budgets.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

interface IBudget {
  id: number;
  amount_limit: string;
  start_date: string;
  end_date: string;
  category: {
    name: string;
    category_type: string;
  } | null;
}

function Budgets() {
  const navigate = useNavigate();
  const [budgets, setBudgets] = useState<IBudget[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [categoryId, setCategoryId] = useState('');
  const [amountLimit, setAmountLimit] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // Se não houver token, redireciona
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/');
      return;
    }
    loadBudgets();
    loadCategories();
  }, [navigate]);

  const loadBudgets = async () => {
    try {
      const res = await api.get('/budgets/');
      setBudgets(res.data);
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        // Redirecionar para login
        navigate('/');
      } else {
        setErrorMsg('Erro ao carregar orçamentos');
      }
    }
  };

  const loadCategories = async () => {
    try {
      const res = await api.get('/categories/');
      setCategories(res.data);
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        navigate('/');
      } else {
        setErrorMsg('Erro ao carregar categorias');
      }
    }
  };

  const handleCreateBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/budgets/', {
        category_id: categoryId,
        amount_limit: amountLimit,
        start_date: startDate,
        end_date: endDate,
      });
      setCategoryId('');
      setAmountLimit('');
      setStartDate('');
      setEndDate('');
      loadBudgets();
    } catch (error: any) {
      setErrorMsg('Erro ao criar orçamento');
    }
  };

  return (
    <div className="container mx-auto p-4 fade-in">
      <h2 className="text-2xl font-bold mb-4">Orçamentos</h2>
      <form className="flex flex-col gap-2 bg-white p-4 shadow-md rounded" onSubmit={handleCreateBudget}>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="border p-2 rounded"
          required
        >
          <option value="">--Categoria--</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name} ({cat.category_type})
            </option>
          ))}
        </select>
        <input
          type="number"
          step="0.01"
          placeholder="Valor máximo"
          className="border p-2 rounded"
          value={amountLimit}
          onChange={(e) => setAmountLimit(e.target.value)}
          required
        />
        <input
          type="date"
          className="border p-2 rounded"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
        <input
          type="date"
          className="border p-2 rounded"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition-colors"
        >
          Criar Orçamento
        </button>
      </form>
      {errorMsg && <p className="text-red-600 mt-2">{errorMsg}</p>}

      <h3 className="text-xl font-semibold mt-4 mb-2">Lista de Orçamentos</h3>
      <div className="grid gap-2">
        {budgets.map((b) => (
          <div
            key={b.id}
            className="border border-gray-300 p-3 rounded bg-white shadow-sm"
          >
            <p>
              <strong>Categoria: </strong>
              {b.category ? b.category.name : 'N/A'}
            </p>
            <p>
              <strong>Limite: </strong>
              {b.amount_limit}€
            </p>
            <p>
              <strong>Período: </strong>
              {b.start_date} até {b.end_date}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Budgets;
