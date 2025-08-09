import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';

const ExpenseForm = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    const [category, setCategory] = useState('');
    const [transactionType, setTransactionType] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newExpense = {
            name,
            description,
            amount: parseFloat(amount),
            date,
            category,
            transactionType,
        };

        try {
            const token = localStorage.getItem('token');
            console.log('Sending expense:', newExpense);
            console.log('Authorization Header:', `Bearer ${token}`);

            const response = await axios.post('http://localhost:5000/expenses', newExpense, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setSuccessMessage(response.data.message);
            setErrorMessage('');
            setTimeout(() => {
                navigate('/');
            }, 500);
        } catch (error) {
            console.error('Error adding expense:', error);
            if (error.response) {
                setErrorMessage(error.response.data.message || 'Failed to add expense. Please try again.');
            } else if (error.request) {
                setErrorMessage('No response from the server. Please try again.');
            } else {
                setErrorMessage('Error: ' + error.message);
            }
        }
    };

    const creditCategories = ['salary', 'tip', 'other'];
    const expenseCategories = ['groceries', 'rent', 'food', 'medical', 'utilities', 'entertainment', 'transportation', 'other'];

    return (
        <div className="container mt-4">
            <h1>Add Expense</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="name" className="mb-3">
                    <Form.Label>Expense Name:</Form.Label>
                    <Form.Control
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="description" className="mb-3">
                    <Form.Label>Description:</Form.Label>
                    <Form.Control
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="amount" className="mb-3">
                    <Form.Label>Amount:</Form.Label>
                    <Form.Control
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="date" className="mb-3">
                    <Form.Label>Date:</Form.Label>
                    <Form.Control
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="transactionType" className="mb-3">
                    <Form.Label>Transaction Type:</Form.Label>
                    <Form.Select
                        value={transactionType}
                        onChange={(e) => setTransactionType(e.target.value)}
                        required
                    >
                        <option value="" disabled>Select a type</option>
                        <option value="credit">Credit</option>
                        <option value="expense">Expense</option>
                    </Form.Select>
                </Form.Group>

                <Form.Group controlId="category" className="mb-3">
                    <Form.Label>Category:</Form.Label>
                    <Form.Select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    >
                        <option value="" disabled>Choose...</option>
                        {(transactionType === 'credit' ? creditCategories : expenseCategories).map((cat) => (
                            <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                        ))}
                    </Form.Select>
                </Form.Group>

                <Button variant="primary" type="submit">
                    Add Expense
                </Button>
            </Form>
            {successMessage && <Alert variant="success" className="mt-3">{successMessage}</Alert>}
            {errorMessage && <Alert variant="danger" className="mt-3">{errorMessage}</Alert>}
        </div>
    );
};

export default ExpenseForm;
