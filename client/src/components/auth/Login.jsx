import { useState } from 'react';
import { useAuth } from '../../store/AuthContext';
import './Auth.css';

const Login = ({ onToggle }) => {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="auth-overlay">
            <div className="auth-card">
                <h1>Welcome Back</h1>
                <p>Sign in to your Mark-Space account</p>

                <form onSubmit={handleSubmit}>
                    {error && <div className="auth-error">{error}</div>}
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="name@example.com"
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                        />
                    </div>
                    <button type="submit" className="auth-submit">Sign In</button>
                </form>

                <p className="auth-footer">
                    Don't have an account? <button onClick={onToggle}>Create one</button>
                </p>
            </div>
        </div>
    );
};

export default Login;
