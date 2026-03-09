import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../api';
import { IconAlertCircle, IconCheckCircle, IconLoader, IconShield, IconTag, IconUser } from '../components/Icons';
import BrandLogo from '../components/BrandLogo';
import '../styles/Auth.css';

const ROLES = [
    { value: 'buyer', label: 'Buyer', desc: 'Browse & place bids', Icon: IconUser },
    { value: 'seller', label: 'Seller', desc: 'List & manage auctions', Icon: IconTag },
    { value: 'admin', label: 'Admin', desc: 'Platform administration', Icon: IconShield },
];

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'buyer' });
    const [confirmPwd, setConfirmPwd] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData(p => ({ ...p, [e.target.name]: e.target.value }));
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); setSuccess('');

        if (formData.password !== confirmPwd) {
            setError('Passwords do not match.');
            return;
        }
        if (formData.password.length < 3) {
            setError('Password must be at least 3 characters.');
            return;
        }

        setLoading(true);
        try {
            await registerUser(formData);
            setSuccess('Account created successfully. Redirecting to login…');
            setTimeout(() => navigate('/login'), 1600);
        } catch (err) {
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box" style={{ maxWidth: '480px' }}>

                <BrandLogo size={36} />

                <h1>Create account</h1>
                <p className="auth-subtitle">Join the real-time auction platform</p>

                {error && <div className="error-message"><IconAlertCircle size={15} />{error}</div>}
                {success && (
                    <div className="success-message">
                        <IconCheckCircle size={15} style={{ flexShrink: 0 }} />{success}
                    </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                    <div className="form-group">
                        <label htmlFor="reg-name">Full name</label>
                        <input id="reg-name" type="text" name="name" value={formData.name}
                            onChange={handleChange} required placeholder="John Doe" autoComplete="name" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="reg-email">Email address</label>
                        <input id="reg-email" type="email" name="email" value={formData.email}
                            onChange={handleChange} required placeholder="you@example.com" autoComplete="email" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="reg-password">Password</label>
                        <input id="reg-password" type="password" name="password" value={formData.password}
                            onChange={handleChange} required placeholder="••••••••" autoComplete="new-password" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="reg-confirm">Confirm password</label>
                        <input id="reg-confirm" type="password" value={confirmPwd}
                            onChange={e => setConfirmPwd(e.target.value)} required placeholder="••••••••" />
                    </div>

                    {/* Role picker */}
                    <div className="form-group">
                        <label>Account type</label>
                        <div className="role-cards">
                            {ROLES.map(({ value, label, desc, Icon }) => (
                                <div
                                    key={value}
                                    id={`role-${value}`}
                                    className={`role-card ${formData.role === value ? 'active' : ''}`}
                                    onClick={() => setFormData(p => ({ ...p, role: value }))}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={e => e.key === 'Enter' && setFormData(p => ({ ...p, role: value }))}
                                >
                                    <div className="role-icon-wrap">
                                        <Icon size={18} />
                                    </div>
                                    <div className="role-label">{label}</div>
                                    <div className="role-desc">{desc}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button id="register-submit" type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '4px' }}>
                        {loading
                            ? <span className="btn-loading"><IconLoader size={15} className="spin" /> Creating account…</span>
                            : 'Create Account'}
                    </button>
                </form>

                <p className="auth-link">
                    Already have an account? <Link to="/login">Sign in</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
