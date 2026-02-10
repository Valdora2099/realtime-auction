import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Auth.css';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // TODO: Replace with actual backend API call
            // const response = await fetch('http://localhost:8080/auth/login', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify(formData)
            // });
            // const data = await response.json();

            // Mock authentication for demonstration
            const mockUser = {
                userId: 1,
                name: 'Test User',
                email: formData.email,
                role: 'buyer' // Change to 'admin' or 'seller' to test different dashboards
            };
            const mockToken = 'mock-jwt-token-' + Date.now();

            // Store user data and token in localStorage
            localStorage.setItem('user', JSON.stringify(mockUser));
            localStorage.setItem('token', mockToken);

            // Redirect based on role
            navigate(`/${mockUser.role}/dashboard`);
        } catch (err) {
            setError('Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h1>BidPulse Login</h1>
                <p className="auth-subtitle">Secure authentication with JWT</p>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Enter your password"
                        />
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <p className="auth-link">
                    Don't have an account? <Link to="/register">Register here</Link>
                </p>

                <div className="security-info">
                    <p>🔒 Secured with JWT Authentication</p>
                    <p>🛡️ Role-based Access Control</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
