import { useState, useEffect } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from '@dnd-kit/sortable';
import { useBookmarks } from '../../store/BookmarkContext';
import Panel from './Panel';
import BookmarkCard from './BookmarkCard';
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
            // Default panels if none exist in cloud
            setActivePanels([
                { id: 'p1', title: '🔖 Recent Bookmarks', type: 'bookmarks', order: 0 },
                { id: 'p2', title: '🎬 Media', type: 'bookmarks', filter: 'Media', order: 1 },
                { id: 'p3', title: '📰 Latest News', type: 'news', order: 2 },
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
            let filtered = panel.filter
                ? bookmarks.filter(b => b.tags && b.tags.includes(panel.filter))
                : bookmarks;

            if (query) {
                const q = query.toLowerCase();
                filtered = filtered.filter(b =>
                    b.title?.toLowerCase().includes(q) ||
                    b.url?.toLowerCase().includes(q) ||
                    b.tags?.toLowerCase().includes(q)
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
                            onEdit={(b) => console.log('Edit', b)}
                        />
                    ))}
                    {filtered.length === 0 && <p className="empty-msg">No bookmarks in this category.</p>}
                </div>
            );
        }

        if (panel.type === 'news') {
            return <NewsWidget />;
        }

        return <p>Custom widget content</p>;
    };

    if (loading) return <div className="loading-state">Syncing with cloud...</div>;

    return (
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
                                onRemove={() => console.log('Remove', panel.id)}
                            >
                                {renderPanelContent(panel)}
                            </Panel>
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    );
};

export default Dashboard;
