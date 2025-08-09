import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const EditExpense = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', amount: '', date: '', category: '', transactionType: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const creditCategories = ['salary', 'tip', 'other'];
    const expenseCategories = ['groceries', 'rent', 'food', 'medical', 'utilities', 'entertainment', 'transportation', 'other'];

    useEffect(() => {
        const fetchExpense = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:5000/expenses/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const fetchedExpense = response.data;
                fetchedExpense.date = new Date(fetchedExpense.date).toISOString().split('T')[0]; // Format date for input type="date"

                setFormData(fetchedExpense);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching expense:', error);
                setError('Could not fetch expense data.');
                setLoading(false);
            }
        };
        fetchExpense();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedFormData = {
            ...formData,
            name: formData.name.trim(),
            amount: formData.amount,
            date: formData.date,
            category: formData.category.trim(),
            transactionType: formData.transactionType.trim(),
        };

        const validTransactionTypes = ['credit', 'expense'];
        if (!validTransactionTypes.includes(updatedFormData.transactionType)) {
            setError('Invalid transaction type selected.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/expenses/${id}`, updatedFormData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            navigate('/');
        } catch (error) {
            console.error('Error updating expense:', error);
            setError('Could not update expense. Please try again.');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="container mt-5">
            <h1>Edit Expense</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formExpenseName">
                    <Form.Label>Expense Name</Form.Label>
                    <Form.Control
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Expense Name"
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formAmount">
                    <Form.Label>Amount</Form.Label>
                    <Form.Control
                        type="number"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        placeholder="Amount"
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formDate">
                    <Form.Label>Date</Form.Label>
                    <Form.Control
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formTransactionType">
                    <Form.Label>Transaction Type</Form.Label>
                    <Form.Control
                        as="select"
                        value={formData.transactionType}
                        onChange={(e) => setFormData({ ...formData, transactionType: e.target.value })}
                        required
                    >
                        <option value="">Select Transaction Type</option>
                        <option value="expense">Expense</option>
                        <option value="credit">Credit</option>
                    </Form.Control>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formCategory">
                    <Form.Label>Category</Form.Label>
                    <Form.Control
                        as="select"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        required
                    >
                        <option value="">Choose a category...</option>
                        {(formData.transactionType === 'credit' ? creditCategories : expenseCategories).map((cat) => (
                            <option key={cat} value={cat}>
                                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </option>
                        ))}
                    </Form.Control>
                </Form.Group>

                <Button variant="primary" type="submit">
                    Save
                </Button>
            </Form>
            {error && <p className="text-danger">{error}</p>}
        </div>
    );
};

export default EditExpense;
