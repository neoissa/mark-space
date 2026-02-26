import { createContext, useState, useContext, useCallback } from 'react';
import { useAuth } from './AuthContext';

const BookmarkContext = createContext();

export const BookmarkProvider = ({ children }) => {
    const { token } = useAuth();
    const [bookmarks, setBookmarks] = useState([]);
    const [panels, setPanels] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchAll = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const [bmRes, pRes] = await Promise.all([
                fetch('http://localhost:5000/api/bookmarks', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('http://localhost:5000/api/panels', { headers: { 'Authorization': `Bearer ${token}` } }),
            ]);
            const bmData = await bmRes.json();
            const pData = await pRes.json();
            if (bmRes.ok) setBookmarks(bmData);
            if (pRes.ok) setPanels(pData);
        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    }, [token]);

    const addBookmark = async (bm) => {
        const res = await fetch('http://localhost:5000/api/bookmarks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(bm),
        });
        if (res.ok) {
            const newBm = await res.json();
            setBookmarks(prev => [newBm, ...prev]);
            return newBm;
        }
    };

    const updateBookmark = async (id, updates) => {
        const res = await fetch(`http://localhost:5000/api/bookmarks/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(updates),
        });
        if (res.ok) {
            const updated = await res.json();
            setBookmarks(prev => prev.map(b => b.id === id ? updated : b));
            return updated;
        }
    };

    const deleteBookmark = async (id) => {
        const res = await fetch(`http://localhost:5000/api/bookmarks/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` },
        });
        if (res.ok) {
            setBookmarks(prev => prev.filter(b => b.id !== id));
        }
    };

    const toggleFavorite = async (id) => {
        const bm = bookmarks.find(b => b.id === id);
        if (!bm) return;
        return updateBookmark(id, { ...bm, isFavorite: !bm.isFavorite });
    };

    return (
        <BookmarkContext.Provider value={{
            bookmarks, panels, loading, fetchAll,
            addBookmark, updateBookmark, deleteBookmark, toggleFavorite
        }}>
            {children}
        </BookmarkContext.Provider>
    );
};

export const useBookmarks = () => useContext(BookmarkContext);
