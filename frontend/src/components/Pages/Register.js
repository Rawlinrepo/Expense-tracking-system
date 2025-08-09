import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AvatarSelector from './SetAvatar';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '', avatarCategory: '', avatarType: '' });
    const [errorMessage, setErrorMessage] = useState('');
    const [selectedAvatarName, setSelectedAvatarName] = useState('');
    const navigate = useNavigate();

    const handleAvatarSelection = (category, name) => {
        setSelectedAvatarName(name);
        setFormData(prev => ({ ...prev, avatarCategory: category, avatarType: name }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.avatarType) {
            setErrorMessage('Please select an avatar.');
            return;
        }

        try {
            await axios.post('http://localhost:5000/register', formData);
            navigate('/login');
        } catch (error) {
            setErrorMessage('This email is already registered. Please use a different email.');
        }
    };

    return (
        <div className="container mt-5">
            <h1 style={{fontSize:'58px', color:'white'}}>Register</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="text"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        placeholder="Username"
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Enter email"
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="Password"
                        required
                    />
                </Form.Group>

                <AvatarSelector onAvatarSelect={handleAvatarSelection} />

                <Button variant="primary" type="submit" style={{marginTop:'10px'}}>
                    Register
                </Button>
            </Form>

            {errorMessage && <p className="text-danger mt-3">{errorMessage}</p>}
            {selectedAvatarName && <h3>Selected Avatar: {selectedAvatarName}</h3>}
        </div>
    );
};

export default Register;