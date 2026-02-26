import { useState, useEffect } from 'react';
import { useAuth } from '../../store/AuthContext';
import './Header.css';

const Header = ({ onSearch, onAdd }) => {
    const { user, logout } = useAuth();
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === '/' && document.activeElement.tagName !== 'INPUT') {
                e.preventDefault();
                document.querySelector('.search-container input')?.focus();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <header className="main-header">
            <div className="header-left">
                <h1 className="logo">MARK<span>.</span>SPACE</h1>
            </div>

            <div className="header-center">
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search bookmarks, tags, folders..."
                        onChange={(e) => onSearch(e.target.value)}
                    />
                    <kbd>/</kbd>
                </div>
            </div>

            <div className="header-right">
                {user ? (
                    <div className="user-info">
                        <button onClick={onAdd} className="add-btn-header">＋ Add</button>
                        <button onClick={toggleTheme} className="icon-btn">
                            {theme === 'light' ? '🌙' : '☀️'}
                        </button>
                        <span className="user-name">{user.name}</span>
                        <button onClick={logout} className="logout-btn">Logout</button>
                    </div>
                ) : (
                    <button className="login-btn">Sign In</button>
                )}
            </div>
        </header>
    );
};

export default Header;
