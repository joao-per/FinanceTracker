import React, { useEffect, useState } from 'react';
import api from '../services/api';

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories]     = useState([]);
  const [accounts, setAccounts]         = useState([]);

  // Form inputs
  const [accountId, setAccountId]       = useState('');
  const [categoryId, setCategoryId]     = useState('');
  const [type, setType]                 = useState('expense');
  const [amount, setAmount]             = useState('');
  const [description, setDescription]   = useState('');
  const [date, setDate]                 = useState('');

  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [txRes, catRes, accRes] = await Promise.all([
        api.get('/transactions/'),
        api.get('/categories/'),
        api.get('/accounts/')
      ]);
      setTransactions(txRes.data);
      setCategories(catRes.data);
      setAccounts(accRes.data);
      // Se quiseres selecionar por omissão a primeira conta:
      if (accRes.data.length > 0) setAccountId(accRes.data[0].id);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      await api.post('/transactions/', {
        account: accountId,
        category_id: categoryId,
        transaction_type: type,
        amount,
        description,
        date
      });
      // Limpa form e recarrega
      setAmount('');
      setDescription('');
      setDate('');
      loadData();
    } catch (error) {
      setErrorMsg('Erro ao criar transação.');
    }
  };

  return (
    <div className="container fade-in">
      <h2>Transações</h2>
      <form onSubmit={handleSubmit} className="transaction-form">
        <label>Conta:</label>
        <select value={accountId} onChange={(e) => setAccountId(e.target.value)}>
          {accounts.map(acc => (
            <option key={acc.id} value={acc.id}>{acc.name}</option>
          ))}
        </select>

        <label>Tipo:</label>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="expense">Despesa</option>
          <option value="income">Rendimento</option>
        </select>

        <label>Categoria:</label>
        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
          <option value="">--Selecione--</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.name} ({cat.category_type})
            </option>
          ))}
        </select>

        <label>Valor (€):</label>
        <input
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />

        <label>Data:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <label>Descrição:</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button type="submit">Adicionar</button>
      </form>
      {errorMsg && <p className="error-message">{errorMsg}</p>}

      <h3>Lista de Transações</h3>
      <div className="transaction-list">
        {transactions.map(tx => (
          <div key={tx.id} className="transaction-list-item">
            <div>
              <strong>{tx.transaction_type.toUpperCase()}</strong> - {tx.amount}€  
              {' '}| {tx.category ? tx.category.name : 'N/A'} 
              {' '}| Data: {tx.date}
            </div>
            <div>{tx.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Transactions;
