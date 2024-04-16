import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useUser } from '../components/UserContext';  // Correct path as needed

function AuthPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true); // State to toggle between login and signup
    const navigate = useNavigate();
    const { setUser } = useUser();  // Use the setUser from context

    const handleAuth = async (event) => {
        event.preventDefault();
        const url = isLogin ? 'http://localhost:8000/poke_user/login/' : 'http://localhost:8000/poke_user/signup/';
        try {
            const response = await axios.post(url, { email, password });
            console.log(`${isLogin ? 'Login' : 'Signup'} successful:`, response.data);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            localStorage.setItem('token', response.data.token);
            setUser(response.data.user);
            navigate('/'); // Redirect to home or another path upon success
        } catch (error) {
            console.error(`${isLogin ? 'Login' : 'Signup'} failed:`, error);
            alert(`${isLogin ? 'Login' : 'Signup'} failed!`);
        }
    };

    return (
        <div>
            <h2>{isLogin ? 'Login' : 'Signup'} Page</h2>
            <Form onSubmit={handleAuth}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>
                <Button variant="primary" type="submit">
                    {isLogin ? 'Log In' : 'Sign Up'}
                </Button>
                <Button variant="secondary" onClick={() => setIsLogin(!isLogin)} className="ms-2">
                    {isLogin ? 'Need an account? Sign up' : 'Have an account? Log in'}
                </Button>
            </Form>
        </div>
    );
}

export default AuthPage;
