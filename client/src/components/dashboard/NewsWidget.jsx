import { useState, useEffect } from 'react';
import { Newspaper, ExternalLink, Settings, ChevronLeft } from 'lucide-react';
import { useBookmarks } from '../../store/BookmarkContext';
import './NewsWidget.css';

const PRESET_SOURCES = [
    { id: 'bbc', name: 'BBC News', url: 'https://www.bbc.com/news' },
    { id: 'cnn', name: 'CNN', url: 'https://edition.cnn.com' },
    { id: 'techcrunch', name: 'TechCrunch', url: 'https://techcrunch.com' },
    { id: 'aljazeera', name: 'Al Jazeera', url: 'https://www.aljazeera.com' },
];

const NewsWidget = () => {
    const { newsSources } = useBookmarks();
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSettingsMode, setIsSettingsMode] = useState(false);
    const [selectedSource, setSelectedSource] = useState(PRESET_SOURCES[2]); // Default TechCrunch

    useEffect(() => {
        setLoading(true);
        // Mocking source switching
        const mockHeadlines = [
            { id: 1, title: `${selectedSource.name}: Latest Developments`, time: "1h ago", url: selectedSource.url },
            { id: 2, title: `Global Trends in ${selectedSource.name} reporting`, time: "3h ago", url: selectedSource.url },
            { id: 3, title: "Market Reaction to Recent Events", time: "5h ago", url: selectedSource.url },
            { id: 4, title: "Insights into the Future of Digital Platforms", time: "12h ago", url: selectedSource.url },
        ];

        setTimeout(() => {
            setNews(mockHeadlines);
            setLoading(false);
        }, 800);
    }, [selectedSource]);

    if (isSettingsMode) {
        return (
            <div className="news-settings">
                <div className="settings-header">
                    <button onClick={() => setIsSettingsMode(false)} className="back-btn">
                        <ChevronLeft size={18} /> Back
                    </button>
                    <h4>Select News Source</h4>
                </div>
                <div className="sources-list">
                    {PRESET_SOURCES.map(source => (
                        <button
                            key={source.id}
                            className={`source-btn ${selectedSource.id === source.id ? 'active' : ''}`}
                            onClick={() => {
                                setSelectedSource(source);
                                setIsSettingsMode(false);
                            }}
                        >
                            {source.name}
                        </button>
                    ))}
                    {newsSources.map(source => (
                        <button key={source.id} className="source-btn custom">
                            {source.name} (Custom)
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="news-widget-container">
            <div className="news-widget-header">
                <span className="current-source">{selectedSource.name}</span>
                <button onClick={() => setIsSettingsMode(true)} className="settings-btn" title="Settings">
                    <Settings size={16} />
                </button>
            </div>

            {loading ? (
                <div className="news-loading">Updating headlines...</div>
            ) : (
                <div className="news-list">
                    {news.map(item => (
                        <a key={item.id} href={item.url} target="_blank" rel="noreferrer" className="news-item">
                            <div className="news-icon"><Newspaper size={16} /></div>
                            <div className="news-info">
                                <h4 className="news-title">{item.title}</h4>
                                <span className="news-time">{item.time}</span>
                            </div>
                            <ExternalLink size={14} className="news-external" />
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NewsWidget;
