import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Maximize2, X } from 'lucide-react';
import './Panel.css';

const Panel = ({ id, title, children, onRemove, onExpand }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
        opacity: isDragging ? 0.5 : 1
    };

    return (
        <div ref={setNodeRef} style={style} className={`dashboard-panel ${isDragging ? 'dragging' : ''}`}>
            <div className="panel-header">
                <div className="panel-drag-handle" {...attributes} {...listeners}>
                    <GripVertical size={18} />
                </div>
                <h3 className="panel-title">{title}</h3>
                <div className="panel-actions">
                    <button onClick={onExpand} title="Expand"><Maximize2 size={16} /></button>
                    <button onClick={onRemove} title="Remove" className="remove-btn"><X size={16} /></button>
                </div>
            </div>
            <div className="panel-content">
                {children}
            </div>
        </div>
    );
};

export default Panel;
