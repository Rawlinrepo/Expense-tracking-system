import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errorMessage, setErrorMessage] = useState('');
    const [isFocused, setIsFocused] = useState({ email: false, password: false });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/login', formData);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('username', response.data.username);
            if (response.data.avatar) {
                localStorage.setItem('avatar', response.data.avatar);
            }
            localStorage.setItem('avatarCategory', response.data.avatarCategory);
            localStorage.setItem('avatarType', response.data.avatarType);
            navigate('/');
        } catch (error) {
            setErrorMessage('Login failed. Check your credentials.');
        }
    };

    const handleFocus = (field) => {
        setIsFocused((prev) => ({ ...prev, [field]: true }));
    };

    const handleBlur = (field) => {
        setIsFocused((prev) => ({ ...prev, [field]: false }));
    };

    return (
        <div className="container mt-5">
            <h1 style={{fontSize:'58px', color:'white'}}>Login</h1>
            <Form onSubmit={handleSubmit}>
           
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                        style={{borderColor: '#ffffff'}}
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Enter email"
                        required
                        onFocus={() => handleFocus('email')}
                        onBlur={() => handleBlur('email')}
                        isInvalid={!isFocused.email && formData.email.length === 0}
                    />
                    
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control 
                        style={{borderColor: '#ffffff'}}
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="Password"
                        required
                        onFocus={() => handleFocus('password')}
                        onBlur={() => handleBlur('password')}
                        isInvalid={!isFocused.password && formData.password.length === 0}
                    />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Login
                </Button>
            </Form>
            {errorMessage && <p className="text-danger">{errorMessage}</p>}
        </div>
    );
};

export default Login;