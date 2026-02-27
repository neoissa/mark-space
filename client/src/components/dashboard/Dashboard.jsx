import { useState, useEffect } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from '@dnd-kit/sortable';
import { useBookmarks } from '../../store/BookmarkContext';
import Panel from './Panel';
import BookmarkCard from './BookmarkCard';
import NewsWidget from './NewsWidget';
import NotesPanel from './NotesPanel';
import WeatherWidget from './WeatherWidget';
import AppLoader from './AppLoader';
import './Dashboard.css';

const Dashboard = ({ query }) => {
    const { bookmarks, panels, fetchAll, loading, deleteBookmark, toggleFavorite } = useBookmarks();
    const [activePanels, setActivePanels] = useState([]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    useEffect(() => {
        if (panels.length > 0) {
            setActivePanels(panels);
        } else {
            // Default modular layout
            setActivePanels([
                { id: 'p1', title: 'My Bookmarks', type: 'bookmarks', icon: 'Bookmark', order: 0 },
                { id: 'p2', title: 'Favorite News', type: 'news', icon: 'Newspaper', order: 1 },
                { id: 'p3', title: 'Quick Notes', type: 'notes', icon: 'FileText', order: 2 },
                { id: 'p4', title: 'Weather', type: 'weather', icon: 'CloudSun', order: 3 },
                { id: 'p5', title: 'Google Sites', type: 'bookmarks', filter: 'google-sites', icon: 'Globe', order: 4 },
                { id: 'p6', title: 'Work Links', type: 'bookmarks', filter: 'work', icon: 'Briefcase', order: 5 },
            ]);
        }
    }, [panels]);

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            setActivePanels((items) => {
                const oldIndex = items.findIndex(i => i.id === active.id);
                const newIndex = items.findIndex(i => i.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
            // Here we would also sync the new order to the backend
        }
    };

    const renderPanelContent = (panel) => {
        if (panel.type === 'bookmarks') {
            let filtered = bookmarks;

            if (panel.filter === 'google-sites') {
                filtered = bookmarks.filter(b => b.url?.includes('sites.google.com'));
            } else if (panel.filter === 'work') {
                filtered = bookmarks.filter(b => b.tags?.includes('Work') || b.folder === 'Work');
            } else if (panel.filter) {
                filtered = bookmarks.filter(b => b.tags?.includes(panel.filter));
            }

            if (query) {
                const q = query.toLowerCase();
                filtered = filtered.filter(b =>
                    b.title?.toLowerCase().includes(q) ||
                    b.url?.toLowerCase().includes(q) ||
                    (typeof b.tags === 'string' && b.tags.toLowerCase().includes(q))
                );
            } else if (!panel.filter) {
                filtered = filtered.slice(0, 10);
            }

            return (
                <div className="bookmarks-grid-mini">
                    {filtered.map(bm => (
                        <BookmarkCard
                            key={bm.id}
                            bookmark={bm}
                            onFavorite={() => toggleFavorite(bm.id)}
                            onDelete={() => deleteBookmark(bm.id)}
                            onOpen={() => trackOpen(bm.id)}
                            onEdit={(b) => console.log('Edit', b)}
                        />
                    ))}
                    {filtered.length === 0 && <p className="empty-msg">No bookmarks in this category.</p>}
                </div>
            );
        }

        if (panel.type === 'news') return <NewsWidget />;
        if (panel.type === 'notes') return <NotesPanel />;
        if (panel.type === 'weather') return <WeatherWidget />;

        return <p>Custom widget coming soon...</p>;
    };

    if (loading) return <div className="loading-state">Syncing with cloud...</div>;

    return (
        <div className="dashboard-wrapper">
            <div className="dashboard-container">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={activePanels.map(p => p.id)}
                        strategy={rectSortingStrategy}
                    >
                        <div className="panels-grid">
                            {activePanels.map((panel) => (
                                <Panel
                                    key={panel.id}
                                    id={panel.id}
                                    title={panel.title}
                                    icon={panel.icon}
                                    onRemove={() => console.log('Remove', panel.id)}
                                >
                                    {renderPanelContent(panel)}
                                </Panel>
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            </div>
            <AppLoader />
        </div>
    );
};

export default Dashboard;
