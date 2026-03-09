import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../api';
import { IconAlertCircle, IconUser, IconZap, IconLoader } from '../components/Icons';
import BrandLogo from '../components/BrandLogo';
import '../styles/Auth.css';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData(p => ({ ...p, [e.target.name]: e.target.value }));
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const user = await loginUser(formData.email, formData.password);
            // loginUser() → api.js storeAuth() already saved the real JWT + user
            navigate(`/${user.role}/dashboard`);
        } catch (err) {
            setError(err.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">

                <BrandLogo size={36} />

                <h1>Sign in</h1>
                <p className="auth-subtitle">Enter your credentials to access your dashboard</p>

                {error && (
                    <div className="error-message">
                        <IconAlertCircle size={15} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                    <div className="form-group">
                        <label htmlFor="login-email">Email address</label>
                        <input
                            id="login-email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="you@example.com"
                            autoComplete="email"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="login-password">Password</label>
                        <input
                            id="login-password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="••••••••"
                            autoComplete="current-password"
                        />
                    </div>

                    <button id="login-submit" type="submit" className="btn-primary" disabled={loading}>
                        {loading
                            ? <span className="btn-loading"><IconLoader size={15} className="spin" /> Signing in…</span>
                            : 'Sign In'}
                    </button>
                </form>

                <p className="auth-link">
                    Don&apos;t have an account? <Link to="/register">Create one</Link>
                </p>

                <div className="auth-divider" />

                <div className="security-info">
                    <div className="security-badge">
                        <IconUser size={13} />
                        Role-based Access
                    </div>
                    <div className="security-badge">
                        <IconZap size={13} />
                        Real-time Bidding
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
