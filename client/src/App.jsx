import { AuthProvider, useAuth } from './store/AuthContext';
import { BookmarkProvider } from './store/BookmarkContext';
import Header from './components/common/Header';
import Dashboard from './components/dashboard/Dashboard';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import AddBookmarkModal from './components/dashboard/AddBookmarkModal';
import { useState } from 'react';
import './assets/styles/global.css';

const AppContent = () => {
    const { user, loading } = useAuth();
    const [isRegistering, setIsRegistering] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddMode, setIsAddMode] = useState(false); // Added state for AddBookmarkModal

    if (loading) return <div className="loading-state">Initializing Mark-Space...</div>;

    if (!user) {
        return isRegistering ? (
            <Register onToggle={() => setIsRegistering(false)} />
        ) : (
            <Login onToggle={() => setIsRegistering(true)} />
        );
    }

    return (
        <div className="app-container">
            <Header onSearch={setSearchQuery} onAdd={() => setIsAddMode(true)} /> {/* Added onAdd prop */}
            <main className="main-content">
                <Dashboard query={searchQuery} />
            </main>

            <AddBookmarkModal isOpen={isAddMode} onClose={() => setIsAddMode(false)} /> {/* Added AddBookmarkModal */}

            <footer className="footer-bar">
                <p>Mark-Space Cloud © 2026 • Premium Bookmark Management</p>
            </footer>
        </div>
    );
};

function App() {
    return (
        <AuthProvider>
            <BookmarkProvider>
                <AppContent />
            </BookmarkProvider>
        </AuthProvider>
    );
}

export default App;
