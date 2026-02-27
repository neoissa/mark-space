import { useState, useEffect, useRef } from 'react';
import { useBookmarks } from '../../store/BookmarkContext';
import { Save, RefreshCw, ExternalLink, Bold, Italic, List } from 'lucide-react';
import './NotesPanel.css';

const NotesPanel = () => {
    const { notes, addNote } = useBookmarks();
    const [isSaving, setIsSaving] = useState(false);
    const editorRef = useRef(null);

    useEffect(() => {
        if (notes.length > 0 && editorRef.current) {
            editorRef.current.innerHTML = notes[0].content;
        }
    }, [notes]);

    const handleSave = async () => {
        setIsSaving(true);
        const content = editorRef.current.innerHTML;
        await addNote({ title: 'Quick Note', content });
        setIsSaving(false);
    };

    const execCommand = (command) => {
        document.execCommand(command, false, null);
    };

    return (
        <div className="notes-widget">
            <div className="notes-toolbar">
                <div className="formatting-btns">
                    <button onClick={() => execCommand('bold')} title="Bold"><Bold size={16} /></button>
                    <button onClick={() => execCommand('italic')} title="Italic"><Italic size={16} /></button>
                    <button onClick={() => execCommand('insertUnorderedList')} title="Bullet List"><List size={16} /></button>
                </div>

                <div className="toolbar-actions">
                    <button onClick={handleSave} disabled={isSaving} className="save-btn">
                        <Save size={16} /> {isSaving ? 'Saving...' : 'Save'}
                    </button>
                    <button className="sync-btn" title="Sync with Google Keep">
                        <RefreshCw size={16} />
                    </button>
                </div>
            </div>

            <div
                ref={editorRef}
                className="notes-editor-rich"
                contentEditable
                suppressContentEditableWarning
                placeholder="Start typing your notes here..."
            />

            <div className="notes-footer">
                {notes[0]?.isKeepSync && (
                    <div className="keep-status">
                        <span>Linked to Google Keep</span>
                    </div>
                )}
                <a href="https://keep.google.com" target="_blank" rel="noreferrer" className="keep-link">
                    Open Keep <ExternalLink size={12} />
                </a>
            </div>
        </div>
    );
};

export default NotesPanel;
