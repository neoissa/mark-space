import { ExternalLink, Copy, Share2, Heart, Trash2, Edit3 } from 'lucide-react';
import './BookmarkCard.css';

const BookmarkCard = ({ bookmark, onFavorite, onDelete, onEdit, onOpen }) => {
    const getDomain = (url) => {
        try {
            return new URL(url).hostname.replace('www.', '');
        } catch {
            return '';
        }
    };

    const copyUrl = (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(bookmark.url);
        // Could add a toast notification here
    };

    const handleOpen = () => {
        if (onOpen) onOpen(bookmark.id);
        window.open(bookmark.url, '_blank');
    };

    return (
        <div className="bookmark-card">
            <div className="card-favicon">
                <img
                    src={`https://icons.duckduckgo.com/ip3/${getDomain(bookmark.url)}.ico`}
                    alt=""
                    onError={(e) => e.target.src = 'https://icon-library.com/images/default-favicon-icon/default-favicon-icon-16.jpg'}
                />
            </div>

            <div className="card-content">
                <h4 className="card-title">{bookmark.title}</h4>
                <p className="card-domain">{getDomain(bookmark.url)}</p>

                {bookmark.tags && (
                    <div className="card-tags">
                        {bookmark.tags.split(',').map(tag => (
                            <span key={tag} className="tag">{tag.trim()}</span>
                        ))}
                    </div>
                )}
            </div>

            <div className="card-actions">
                <button onClick={handleOpen} title="Open"><ExternalLink size={16} /></button>
                <button onClick={copyUrl} title="Copy URL"><Copy size={16} /></button>
                <button onClick={() => onFavorite(bookmark.id)} title="Favorite" className={bookmark.isFavorite ? 'active' : ''}>
                    <Heart size={16} fill={bookmark.isFavorite ? 'currentColor' : 'none'} />
                </button>
                <div className="more-actions">
                    <button onClick={() => onEdit(bookmark)}><Edit3 size={16} /></button>
                    <button onClick={() => onDelete(bookmark.id)} className="delete-btn"><Trash2 size={16} /></button>
                </div>
            </div>
        </div>
    );
};

export default BookmarkCard;
