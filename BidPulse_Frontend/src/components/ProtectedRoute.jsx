import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRole }) => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const token = localStorage.getItem('token');

    if (!user || !token) {
        return <Navigate to="/login" />;
    }

    if (user.role !== allowedRole) {
        // Redirect to appropriate dashboard based on role
        return <Navigate to={`/${user.role}/dashboard`} />;
    }

    return children;
};

export default ProtectedRoute;
