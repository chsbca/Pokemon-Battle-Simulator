import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../components/axiosConfig';  // Import the configured axios instance
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { UserContext } from '../components/UserContext'; // Assume you have a context for user state


function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setUser } = useContext(UserContext); // Using context to manage user state
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('poke_user/login/', { email, password });
            localStorage.setItem('token', response.data.token);
            axios.defaults.headers.common['Authorization'] = `Token ${response.data.token}`; // Set the token for all future requests
            setUser(response.data.user); // Update context with user info
            navigate('/');  // Redirect to home on successful login
        } catch (error) {
            console.error('Login failed:', error.response?.data);
            alert('Login failed!');
        }
    };

    return (
        <>
            <h2>Login</h2>
            <Form onSubmit={handleLogin}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                    <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                    </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Log In
                </Button>
            </Form>
        </>
    );
}

export default LoginPage;
