import React, { useState, useEffect } from 'react';
import { useAppContext, AppState, Account } from '../context/AppContext';
import { useSound } from '../hooks/useSound';
import { v4 as uuidv4 } from 'uuid';

const AccountsTable: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const { playKeypress, playSuccess, playError } = useSound();
  
  const [formData, setFormData] = useState<Omit<Account, 'id'>>({
    date: new Date().toISOString().split('T')[0],
    amount: 0,
    type: 'income',
    description: '',
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value,
    }));
    playKeypress();
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.description.trim()) {
      playError();
      return;
    }
    
    if (isEditing && editId) {
      dispatch({
        type: 'UPDATE_ACCOUNT',
        payload: {
          id: editId,
          ...formData,
        },
      });
      playSuccess();
    } else {
      dispatch({
        type: 'ADD_ACCOUNT',
        payload: {
          id: uuidv4(),
          ...formData,
        },
      });
      playSuccess();
    }
    
    setFormData({
      date: new Date().toISOString().split('T')[0],
      amount: 0,
      type: 'income',
      description: '',
    });
    setIsEditing(false);
    setEditId(null);
    setShowForm(false);
  };
  
  const handleEdit = (account: Account) => {
    setFormData({
      date: account.date,
      amount: account.amount,
      type: account.type,
      description: account.description,
    });
    setIsEditing(true);
    setEditId(account.id);
    setShowForm(true);
    playKeypress();
  };
  
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      dispatch({ type: 'DELETE_ACCOUNT', payload: id });
      playSuccess();
    }
  };
  
  const totalIncome = state.accounts.reduce(
    (sum, account) => account.type === 'income' ? sum + account.amount : sum,
    0
  );
  
  const totalExpense = state.accounts.reduce(
    (sum, account) => account.type === 'expense' ? sum + account.amount : sum,
    0
  );
  
  const balance = totalIncome - totalExpense;
  
  return (
    <div className="min-h-screen bg-hacker-dark flex flex-col p-4 overflow-hidden">
      <div className="scanlines"></div>
      
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-hacker-neon font-mono text-xl">Accounts Ledger</h1>
        <div>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setIsEditing(false);
              setEditId(null);
              setFormData({
                date: new Date().toISOString().split('T')[0],
                amount: 0,
                type: 'income',
                description: '',
              });
              playKeypress();
            }}
            className="hacker-button mr-2"
          >
            {showForm ? 'Cancel' : 'Add Transaction'}
          </button>
          <button
            onClick={() => dispatch({ type: 'SET_STATE', payload: AppState.COMMAND_CONSOLE })}
            className="hacker-button"
          >
            Terminal
          </button>
        </div>
      </div>
      
      {showForm && (
        <div className="glass-panel p-4 mb-4 animate-fade-in">
          <h2 className="text-hacker-neon font-mono text-lg mb-4">
            {isEditing ? 'Edit Transaction' : 'New Transaction'}
          </h2>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-hacker-neon/70 text-sm font-mono mb-1">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="terminal-input w-full px-3 py-2"
                required
              />
            </div>
            
            <div>
              <label className="block text-hacker-neon/70 text-sm font-mono mb-1">
                Amount
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount || ''}
                onChange={handleChange}
                step="0.01"
                className="terminal-input w-full px-3 py-2"
                required
              />
            </div>
            
            <div>
              <label className="block text-hacker-neon/70 text-sm font-mono mb-1">
                Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="terminal-input w-full px-3 py-2 bg-hacker-dark"
                required
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            
            <div>
              <label className="block text-hacker-neon/70 text-sm font-mono mb-1">
                Description
              </label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="terminal-input w-full px-3 py-2"
                required
              />
            </div>
            
            <div className="md:col-span-2 flex justify-end mt-2">
              <button type="submit" className="hacker-button">
                {isEditing ? 'Update' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="glass-panel p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <h3 className="text-hacker-neon/70 text-sm font-mono">Total Income</h3>
            <p className="text-green-400 font-mono text-lg">
              ${totalIncome.toFixed(2)}
            </p>
          </div>
          
          <div>
            <h3 className="text-hacker-neon/70 text-sm font-mono">Total Expenses</h3>
            <p className="text-hacker-red font-mono text-lg">
              ${totalExpense.toFixed(2)}
            </p>
          </div>
          
          <div>
            <h3 className="text-hacker-neon/70 text-sm font-mono">Balance</h3>
            <p className={`font-mono text-lg ${balance >= 0 ? 'text-green-400' : 'text-hacker-red'}`}>
              ${balance.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex-grow glass-panel p-2 relative overflow-x-auto">
        {state.accounts.length > 0 ? (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-hacker-neon/30">
                <th className="text-hacker-neon font-mono px-4 py-2">Date</th>
                <th className="text-hacker-neon font-mono px-4 py-2">Description</th>
                <th className="text-hacker-neon font-mono px-4 py-2">Type</th>
                <th className="text-hacker-neon font-mono px-4 py-2 text-right">Amount</th>
                <th className="text-hacker-neon font-mono px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {state.accounts.map(account => (
                <tr 
                  key={account.id} 
                  className="border-b border-hacker-dark hover:bg-hacker-neon/5 transition-colors"
                >
                  <td className="text-white/80 font-mono px-4 py-2">{account.date}</td>
                  <td className="text-white/80 font-mono px-4 py-2">{account.description}</td>
                  <td className="font-mono px-4 py-2">
                    <span 
                      className={`px-2 py-1 rounded text-xs ${
                        account.type === 'income' 
                          ? 'bg-green-900/30 text-green-400' 
                          : 'bg-red-900/30 text-hacker-red'
                      }`}
                    >
                      {account.type}
                    </span>
                  </td>
                  <td className={`font-mono px-4 py-2 text-right ${
                    account.type === 'income' ? 'text-green-400' : 'text-hacker-red'
                  }`}>
                    ${account.amount.toFixed(2)}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => handleEdit(account)}
                      className="text-hacker-neon hover:text-hacker-neon/70 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(account.id)}
                      className="text-hacker-red hover:text-hacker-red/70"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex justify-center items-center h-32 text-hacker-neon/50 font-mono">
            No transactions found. Add one to get started.
          </div>
        )}
      </div>
      
      <div className="port-display">
        localhost:{window.location.port || '80'}
      </div>
    </div>
  );
};

export default AccountsTable;
