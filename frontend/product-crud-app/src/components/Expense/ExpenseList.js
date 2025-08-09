import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Collapse, Container } from 'react-bootstrap';
import Analytics from './Analytics';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Stack from 'react-bootstrap/Stack';
import './ExpenseList.css';

const ExpenseList = () => {
  const [expenses, setExpenses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [transactionTypeFilter, setTransactionTypeFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:5000/expenses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setExpenses(response.data);
    } catch (error) {
      setError('Failed to fetch expenses. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const deleteExpense = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/expenses/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchExpenses();
    } catch (error) {
      setError('Failed to delete expense. Please try again later.');
    }
  };

  const filteredExpenses = expenses
    .filter(expense => expense.name?.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(expense => transactionTypeFilter === 'all' || expense.transactionType?.toLowerCase() === transactionTypeFilter);

  const sortedExpenses = useMemo(() => {
    return filteredExpenses.sort((a, b) => {
      let valA, valB;

      switch (sortField) {
        case 'name':
          valA = a.name?.toLowerCase() || '';
          valB = b.name?.toLowerCase() || '';
          break;
        case 'amount':
          valA = Number(a.amount) || 0;
          valB = Number(b.amount) || 0;

          break;
        case 'date':
          valA = new Date(a.date).getTime();
          valB = new Date(b.date).getTime();
          break;
        case 'category':
          valA = a.category?.toLowerCase() || '';
          valB = b.category?.toLowerCase() || '';
          break;
        case 'transactionType':
          valA = a.transactionType?.toLowerCase() || '';
          valB = b.transactionType?.toLowerCase() || '';
          break;
        default:
          valA = a.name?.toLowerCase() || '';
          valB = b.name?.toLowerCase() || '';
      }

      return sortOrder === 'asc' ? (valA > valB ? 1 : valA < valB ? -1 : 0) : (valA < valB ? 1 : valA > valB ? -1 : 0);
    });
  }, [filteredExpenses, sortField, sortOrder]);

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  if (loading) {
    return <div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div>;
  }

  return (
    <Container className="mt-5">

      <Stack direction="horizontal" style={{ display: 'none' }} gap={3} className="mb-3">
        <DropdownButton
          id="dropdown-button-theme"
          variant="secondary"
          title="Select Theme"
          className="mt-2"
          data-bs-theme={theme}
        >
          <Dropdown.Item onClick={() => setTheme('light')}>Light</Dropdown.Item>
          <Dropdown.Item onClick={() => setTheme('dark')}>Dark</Dropdown.Item>
        </DropdownButton>
      </Stack>

      <div className="view-toggle-buttons mb-3">
        <button onClick={() => setShowAnalytics(false)}>Show Expense List</button>
        <button onClick={() => setShowAnalytics(true)}>Show Analytics</button>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {showAnalytics ? (
        <Analytics transactions={expenses} />
      ) : (
        <div>
          <div className="controls mb-3">
            <input
              type="text"
              placeholder="Search Expenses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="d-flex justify-content-between mb-3 align-items-center">
            <div className="sort-controls d-flex align-items-center">
              <label className="me-2" style={{ fontSize: '28px', color: 'white' }}>Sort by:</label>
              <Stack direction="horizontal" gap={2}>
                <DropdownButton
                  id="dropdown-button-sort-field"
                  variant="secondary"
                  title={sortField.charAt(0).toUpperCase() + sortField.slice(1)}
                  className="mt-2"
                  data-bs-theme={theme}
                >
                  <Dropdown.Item onClick={() => setSortField('name')}>Name</Dropdown.Item>
                  <Dropdown.Item onClick={() => setSortField('amount')}>Amount</Dropdown.Item>
                  <Dropdown.Item onClick={() => setSortField('date')}>Date</Dropdown.Item>
                  <Dropdown.Item onClick={() => setSortField('category')}>Category</Dropdown.Item>
                  <Dropdown.Item onClick={() => setSortField('transactionType')}>Type</Dropdown.Item>
                </DropdownButton>

                <DropdownButton
                  id="dropdown-button-sort-order"
                  variant="secondary"
                  title={sortOrder.charAt(0).toUpperCase() + sortOrder.slice(1)}
                  className="mt-2"
                  data-bs-theme={theme}
                >
                  <Dropdown.Item onClick={() => setSortOrder('asc')}>Ascending</Dropdown.Item>
                  <Dropdown.Item onClick={() => setSortOrder('desc')}>Descending</Dropdown.Item>
                </DropdownButton>
              </Stack>
            </div>

            <div className="filter-controls d-flex align-items-center">
              <label className="me-2" style={{ fontSize: '28px', color: 'white' }}>Sort By Transaction Type:</label>
              <DropdownButton
                id="dropdown-button-transaction-type"
                variant="secondary"
                title={transactionTypeFilter.charAt(0).toUpperCase() + transactionTypeFilter.slice(1)}
                className="mt-2"
                data-bs-theme={theme}
              >
                <Dropdown.Item onClick={() => setTransactionTypeFilter('all')}>All</Dropdown.Item>
                <Dropdown.Item onClick={() => setTransactionTypeFilter('expense')}>Only Expense</Dropdown.Item>
                <Dropdown.Item onClick={() => setTransactionTypeFilter('credit')}>Only Credit</Dropdown.Item>
              </DropdownButton>
            </div>
          </div>

          <table className="table" style={{ border: Collapse, overflow: null }}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Category</th>
                <th>Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedExpenses.length > 0 ? (
                sortedExpenses.map(expense => (
                  <tr key={expense.id}>
                    <td style={{ fontFamily: 'Arial, sans-serif', fontSize: '16px' }}>
                      {expense.name || 'No Description'}
                    </td>
                    <td style={{ fontFamily: 'Arial, sans-serif', fontSize: '16px' }}>
                      ${expense.amount || 0}
                    </td>
                    <td style={{ fontFamily: 'Arial, sans-serif', fontSize: '16px' }}>
                      {new Date(expense.date).toLocaleDateString() || 'N/A'}
                    </td>
                    <td style={{ fontFamily: 'Arial, sans-serif', fontSize: '16px', fontWeight: 'bold' }}>
                      {expense.category?.toUpperCase() || 'N/A'}
                    </td>
                    <td style={{ fontFamily: 'Arial, sans-serif', fontSize: '16px', fontWeight: 'bold' }}>
                      {expense.transactionType?.toUpperCase() || 'N/A'}
                    </td>
                    <td>
                      <div className="view-toggle-buttons mb-3">
                        <button className="btn btn-danger" onClick={() => deleteExpense(expense.id)}>Delete</button>
                        <Link to={`/edit/${expense.id}`} className="btn btn-danger">Edit</Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No expenses found.</td>
                </tr>
              )}
            </tbody>


          </table>

        </div>
      )}
    </Container>
  );
};

export default ExpenseList;