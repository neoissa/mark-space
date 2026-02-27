import { useState } from 'react';
import { useBookmarks } from '../../store/BookmarkContext';
import * as Icons from 'lucide-react';
import './AppLoader.css';

const AppLoader = () => {
    const { tabs } = useBookmarks();
    const [activeTabId, setActiveTabId] = useState(null);

    // Default tabs if none exist
    const displayTabs = tabs.length > 0 ? tabs : [
        { id: 'gmail', name: 'Gmail', url: 'https://mail.google.com/mail/u/0/?view=cm&fs=1', icon: 'Mail' },
        { id: 'tasks', name: 'Tasks', url: 'https://tasks.google.com/embed/', icon: 'CheckSquare' },
        { id: 'docs', name: 'Docs', url: 'https://docs.google.com/document/u/0/', icon: 'FileText' },
    ];

    const activeTab = displayTabs.find(t => t.id === activeTabId) || null;

    return (
        <div className="app-loader-container">
            <div className="tab-bar">
                {displayTabs.map(tab => {
                    const Icon = Icons[tab.icon] || Icons.Layers;
                    return (
                        <button
                            key={tab.id}
                            className={`tab-item ${activeTabId === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTabId(activeTabId === tab.id ? null : tab.id)}
                        >
                            <Icon size={18} />
                            <span>{tab.name}</span>
                        </button>
                    );
                })}
            </div>

            {activeTab && (
                <div className="iframe-viewport">
                    <iframe
                        src={activeTab.url}
                        title={activeTab.name}
                        className="app-iframe"
                        allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb"
                        sandbox="allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
                    />
                </div>
            )}
        </div>
    );
};

export default AppLoader;
