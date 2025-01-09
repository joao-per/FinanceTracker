import React, { useEffect, useState } from 'react';
import api from '../services/api';

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [type, setType] = useState('expense');
  const [categories, setCategories] = useState([]);
  const [date, setDate] = useState('');

  useEffect(() => {
    fetchTransactions();
    fetchCategories();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await api.get('/transactions/');
      setTransactions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories/');
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    try {
      const newTransaction = {
        transaction_type: type,
        amount: amount,
        category_id: categoryId,
        date: date,
        account: 1,
      };
      await api.post('/transactions/', newTransaction);
      setAmount('');
      setCategoryId('');
      setType('expense');
      setDate('');
      fetchTransactions();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Transações</h2>
      <form onSubmit={handleAddTransaction}>
        <input
          type="number"
          placeholder="Valor"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="expense">Despesa</option>
          <option value="income">Rendimento</option>
        </select>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
        >
          <option value="">Escolhe a categoria</option>
          {categories.map((cat) => (
            <option value={cat.id} key={cat.id}>
              {cat.name} ({cat.category_type})
            </option>
          ))}
        </select>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <button type="submit">Adicionar</button>
      </form>

      <ul>
        {transactions.map((t) => (
          <li key={t.id}>
            {t.transaction_type} - {t.amount}€ | {t.category ? t.category.name : 'N/A'} | Data: {t.date}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Transactions;
