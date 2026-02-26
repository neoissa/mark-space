import { useState } from 'react';
import { useAuth } from '../../store/AuthContext';
import './Auth.css';

const Register = ({ onToggle }) => {
    const { register } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await register(email, password, name);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="auth-overlay">
            <div className="auth-card">
                <h1>Create Account</h1>
                <p>Join Mark-Space and start organizing</p>

                <form onSubmit={handleSubmit}>
                    {error && <div className="auth-error">{error}</div>}
                    <div className="form-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            placeholder="John Doe"
                        />
                    </div>
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
                    <button type="submit" className="auth-submit">Register</button>
                </form>

                <p className="auth-footer">
                    Already have an account? <button onClick={onToggle}>Sign in</button>
                </p>
            </div>
        </div>
    );
};

export default Register;
