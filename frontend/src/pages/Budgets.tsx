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

const Budgets: React.FC = () => {
  const navigate = useNavigate();
  const [budgets, setBudgets] = useState<IBudget[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [categoryId, setCategoryId] = useState('');
  const [amountLimit, setAmountLimit] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
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
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Orçamentos
      </h2>
      <form
        className="flex flex-col gap-3 bg-white p-4 shadow-md rounded"
        onSubmit={handleCreateBudget}
      >
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
          className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors"
        >
          Criar Orçamento
        </button>
      </form>
      {errorMsg && <p className="text-red-600 mt-2">{errorMsg}</p>}

      <h3 className="text-xl font-semibold mt-6">Lista de Orçamentos</h3>
      <table className="w-full mt-4 bg-white rounded-lg shadow-md">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">Categoria</th>
            <th className="p-2 text-left">Limite</th>
            <th className="p-2 text-left">Período</th>
            <th className="p-2 text-left">Ações</th>
          </tr>
        </thead>
        <tbody>
          {budgets.map((b) => (
            <tr key={b.id} className="border-b">
              <td className="p-2">{b.category ? b.category.name : 'N/A'}</td>
              <td className="p-2">{b.amount_limit}€</td>
              <td className="p-2">
                {b.start_date} até {b.end_date}
              </td>
              <td className="p-2">
                <button className="text-blue-500 hover:underline">Editar</button>{' '}
                |{' '}
                <button className="text-red-500 hover:underline">Remover</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Budgets;
