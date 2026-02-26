import { useState } from 'react';
import { useBookmarks } from '../../store/BookmarkContext';
import { X, Link2, Type, Tag, Folder } from 'lucide-react';
import './AddBookmarkModal.css';

const AddBookmarkModal = ({ isOpen, onClose }) => {
    const { addBookmark } = useBookmarks();
    const [formData, setFormData] = useState({
        title: '',
        url: '',
        tags: '',
        description: '',
        folder: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        await addBookmark(formData);
        onClose();
        setFormData({ title: '', url: '', tags: '', description: '', folder: '' });
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Add New Bookmark</h2>
                    <button onClick={onClose} className="close-btn"><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label><Link2 size={16} /> URL</label>
                        <input
                            type="url"
                            required
                            value={formData.url}
                            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                            placeholder="https://example.com"
                        />
                    </div>

                    <div className="form-group">
                        <label><Type size={16} /> Title</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Site Title"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label><Tag size={16} /> Tags</label>
                            <input
                                type="text"
                                value={formData.tags}
                                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                placeholder="tech, news, personal"
                            />
                        </div>
                        <div className="form-group">
                            <label><Folder size={16} /> Folder</label>
                            <input
                                type="text"
                                value={formData.folder}
                                onChange={(e) => setFormData({ ...formData, folder: e.target.value })}
                                placeholder="Work"
                            />
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
                        <button type="submit" className="save-btn">Save Bookmark</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddBookmarkModal;
