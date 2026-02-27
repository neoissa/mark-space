import { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';

const BookmarkContext = createContext();

export const BookmarkProvider = ({ children }) => {
    const { token, user } = useAuth();
    const [bookmarks, setBookmarks] = useState([]);
    const [panels, setPanels] = useState([]);
    const [tabs, setTabs] = useState([]);
    const [notes, setNotes] = useState([]);
    const [cities, setCities] = useState([]);
    const [newsSources, setNewsSources] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchAll = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const [bmRes, pRes, tRes, nRes, cRes, nsRes] = await Promise.all([
                fetch('http://localhost:5000/api/bookmarks', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('http://localhost:5000/api/panels', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('http://localhost:5000/api/tabs', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('http://localhost:5000/api/notes', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('http://localhost:5000/api/cities', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('http://localhost:5000/api/news-sources', { headers: { 'Authorization': `Bearer ${token}` } }),
            ]);

            const bmData = await bmRes.json();
            const pData = await pRes.json();
            const tData = await tRes.json();
            const nData = await nRes.json();
            const cData = await cRes.json();
            const nsData = await nsRes.json();

            if (bmRes.ok) setBookmarks(bmData);
            if (pRes.ok) setPanels(pData);
            if (tRes.ok) setTabs(tData);
            if (nRes.ok) setNotes(nData);
            if (cRes.ok) setCities(cData);
            if (nsRes.ok) setNewsSources(nsData);
        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if (user) fetchAll();
    }, [user, fetchAll]);

    // Bookmarks
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

    const trackOpen = async (id) => {
        fetch(`http://localhost:5000/api/bookmarks/${id}/open`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
        });
    };

    // Panels
    const syncPanels = async (updatedPanels) => {
        setPanels(updatedPanels);
        // Bulk sync or individual updates logic here
    };

    const addPanel = async (panel) => {
        const res = await fetch('http://localhost:5000/api/panels', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(panel),
        });
        if (res.ok) {
            const newPanel = await res.json();
            setPanels(prev => [...prev, newPanel]);
        }
    };

    // Tabs
    const addTab = async (tab) => {
        const res = await fetch('http://localhost:5000/api/tabs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(tab),
        });
        if (res.ok) {
            const newTab = await res.json();
            setTabs(prev => [...prev, newTab]);
        }
    };

    // Notes
    const addNote = async (note) => {
        const res = await fetch('http://localhost:5000/api/notes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(note),
        });
        if (res.ok) {
            const newNote = await res.json();
            setNotes(prev => [newNote, ...prev]);
        }
    };

    return (
        <BookmarkContext.Provider value={{
            bookmarks, panels, tabs, notes, cities, newsSources, loading, fetchAll,
            addBookmark, updateBookmark, deleteBookmark, trackOpen,
            addPanel, syncPanels, addTab, addNote
        }}>
            {children}
        </BookmarkContext.Provider>
    );
};

export const useBookmarks = () => useContext(BookmarkContext);
