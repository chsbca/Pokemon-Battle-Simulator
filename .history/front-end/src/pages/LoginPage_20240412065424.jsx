// import React, { useState, useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from '../components/axiosConfig';  // Import the configured axios instance
// import Button from "react-bootstrap/Button";
// import Form from "react-bootstrap/Form";
// import UserContext from '../components/UserContext'; // Assume you have a context for user state


// function LoginPage() {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const { setUser } = useContext(UserContext); // Using context to manage user state
//     const navigate = useNavigate();

//     const handleLogin = async (e) => {
//         e.preventDefault();
//         try {
//             const response = await axios.post('poke_user/login/', { email, password });
//             localStorage.setItem('token', response.data.token);
//             axios.defaults.headers.common['Authorization'] = `Token ${response.data.token}`; // Set the token for all future requests
//             setUser(response.data.user); // Update context with user info
//             navigate('/');  // Redirect to home on successful login
//         } catch (error) {
//             console.error('Login failed:', error.response?.data);
//             alert('Login failed!');
//         }
//     };

//     return (
//         <>
//             <h2>Login</h2>
//             <Form onSubmit={handleLogin}>
//                 <Form.Group className="mb-3" controlId="formBasicEmail">
//                     <Form.Label>Email address</Form.Label>
//                     <Form.Control
//                         type="email"
//                         placeholder="Enter email"
//                         value={email}
//                         onChange={e => setEmail(e.target.value)}
//                         required
//                     />
//                     <Form.Text className="text-muted">
//                         We'll never share your email with anyone else.
//                     </Form.Text>
//                 </Form.Group>

//                 <Form.Group className="mb-3" controlId="formBasicPassword">
//                     <Form.Label>Password</Form.Label>
//                     <Form.Control
//                         type="password"
//                         placeholder="Password"
//                         value={password}
//                         onChange={e => setPassword(e.target.value)}
//                         required
//                     />
//                 </Form.Group>
//                 <Button variant="primary" type="submit">
//                     Log In
//                 </Button>
//             </Form>
//         </>
//     );
// }

// export default LoginPage;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from 'axios'; // Don't forget to import axios if you're using it

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user information is stored in localStorage
        const loggedInUser = localStorage.getItem('user');
        if (loggedInUser) {
            setUser(JSON.parse(loggedInUser)); // Set user state if found in storage
        }
    }, []);

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/poke_user/login/', { email, password });
            localStorage.setItem('user', JSON.stringify(response.data.user));
            localStorage.setItem('token', response.data.token);
            setUser(response.data.user); // Update user state
            navigate('/'); // Redirect to home on successful login
        } catch (error) {
            console.error('Login failed:', error);
            alert('Login failed!'); // Show user-friendly error message
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null); // Clear user state
        navigate('/login'); // Redirect to login page
    };

    return (
        <div>
            <h2>{user ? 'Logout' : 'Login'} Page</h2>
            <Form onSubmit={handleLogin}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </Form.Group>

                {user ? (
                    <Button variant="secondary" onClick={handleLogout}>
                        Log Out
                    </Button>
                ) : (
                    <Button variant="primary" type="submit">
                        Log In
                    </Button>
                )}
            </Form>
        </div>
    );
}

export default LoginPage;
