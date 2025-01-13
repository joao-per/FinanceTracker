import React, { useEffect, useState } from 'react';
import api from '../services/api';

function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);

  const [categoryId, setCategoryId] = useState('');
  const [amountLimit, setAmountLimit] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    loadBudgets();
    loadCategories();
  }, []);

  const loadBudgets = async () => {
    const res = await api.get('/budgets/');
    setBudgets(res.data);
  };

  const loadCategories = async () => {
    const res = await api.get('/categories/');
    setCategories(res.data);
  };

  const handleCreateBudget = async (e) => {
    e.preventDefault();
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
  };

  return (
    <div className="container fade-in">
      <h2>Orçamentos</h2>
      <form onSubmit={handleCreateBudget} className="budget-form">
        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
          <option value="">--Categoria--</option>
          {categories.map(cat => (
            <option value={cat.id} key={cat.id}>
              {cat.name} ({cat.category_type})
            </option>
          ))}
        </select>
        <input
          type="number"
          step="0.01"
          placeholder="Valor máximo"
          value={amountLimit}
          onChange={(e) => setAmountLimit(e.target.value)}
          required
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />
        <button type="submit">Criar Orçamento</button>
      </form>

      <h3>Lista de Orçamentos</h3>
      <ul>
        {budgets.map(b => (
          <li key={b.id}>
            Categoria: {b.category ? b.category.name : 'N/A'}  
            - Limite: {b.amount_limit}€  
            - De {b.start_date} até {b.end_date}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Budgets;
