import { useBookmarks } from '../../store/BookmarkContext';
import './QuickLinks.css';

const QuickLinks = () => {
    const { bookmarks } = useBookmarks();
    const favorites = bookmarks.filter(b => b.isFavorite).slice(0, 8);

    if (favorites.length === 0) return null;

    return (
        <div className="quick-links-bar">
            <span className="quick-label">QUICK ACCESS</span>
            {favorites.map(bm => (
                <a key={bm.id} href={bm.url} target="_blank" rel="noreferrer" className="quick-item" title={bm.title}>
                    <img src={`https://icons.duckduckgo.com/ip3/${new URL(bm.url).hostname}.ico`} alt="" />
                </a>
            ))}
        </div>
    );
};

export default QuickLinks;
