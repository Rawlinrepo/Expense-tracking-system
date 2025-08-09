import React from 'react';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import ExpenseList from './components/Expense/ExpenseList';
import ExpenseForm from './components/Expense/ExpenseForm';
import EditExpense from './components/Expense/EditExpense';
import Login from './components/Pages/Login';
import Register from './components/Pages/Register';
import Particles from './components/ProgressBars/Particles';
import Navbar from './components/Navbar/Navbar';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const ProtectedRoute = ({ element: Component }) => {
    const token = localStorage.getItem('token');
    return token ? <Component /> : <Navigate to="/login" />;
};

const App = () => {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('avatar');
        localStorage.removeItem('avatarCategory');
        localStorage.removeItem('avatarType');
        navigate('/login');
    };

    const username = localStorage.getItem('username');
    const avatarCategory = localStorage.getItem('avatarCategory');
    const avatarType = localStorage.getItem('avatarType');
    const avatarUrl = `https://api.dicebear.com/9.x/${avatarCategory}/svg?seed=${avatarType}`;

    return (
        <div className="app-container">
            <Particles />
            <Navbar 
                token={token} 
                handleLogout={handleLogout} 
                username={username} 
                avatarUrl={avatarUrl} 
            />
            <div className="container mt-5 pt-3">
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/" element={<ProtectedRoute element={ExpenseList} />} />
                    <Route path="/add" element={<ProtectedRoute element={ExpenseForm} />} />
                    <Route path="/edit/:id" element={<ProtectedRoute element={EditExpense} />} />
                </Routes>
            </div>
        </div>
    );
};

export default App;