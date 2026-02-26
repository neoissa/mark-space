import { useState, useEffect } from 'react';
import { Newspaper, ExternalLink } from 'lucide-react';
import './NewsWidget.css';

const NewsWidget = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // In a real app, this would fetch from a proxy or RSS service
        // For now, we'll use a high-quality mock feed to demonstrate the UI
        const mockNews = [
            { id: 1, title: "Next.js 15 Released: What's New?", source: "TechCrunch", time: "2h ago", url: "https://techcrunch.com" },
            { id: 2, title: "The Rise of Agentic AI in Software Development", source: "Wired", time: "4h ago", url: "https://wired.com" },
            { id: 3, title: "Market Update: Tech Stocks See Steady Growth", source: "Bloomberg", time: "5h ago", url: "https://bloomberg.com" },
            { id: 4, title: "Prisma 7: A Deep Dive into Migration Patterns", source: "Medium", time: "1d ago", url: "https://medium.com" },
        ];

        setTimeout(() => {
            setNews(mockNews);
            setLoading(false);
        }, 1000);
    }, []);

    if (loading) return <div className="news-loading">Fetching latest headlines...</div>;

    return (
        <div className="news-widget">
            {news.map(item => (
                <a key={item.id} href={item.url} target="_blank" rel="noreferrer" className="news-item">
                    <div className="news-icon"><Newspaper size={16} /></div>
                    <div className="news-info">
                        <h4 className="news-title">{item.title}</h4>
                        <div className="news-meta">
                            <span className="news-source">{item.source}</span>
                            <span className="news-time">{item.time}</span>
                        </div>
                    </div>
                    <ExternalLink size={14} className="news-external" />
                </a>
            ))}
        </div>
    );
};

export default NewsWidget;
