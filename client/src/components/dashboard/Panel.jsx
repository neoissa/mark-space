import * as Icons from 'lucide-react';

const Panel = ({ id, title, icon, children, onRemove, onExpand }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id });

    const IconComponent = icon && Icons[icon] ? Icons[icon] : null;

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
                    <Icons.GripVertical size={18} />
                </div>
                <div className="panel-title-group">
                    {IconComponent && <IconComponent size={20} className="panel-icon-main" />}
                    <h3 className="panel-title">{title}</h3>
                </div>
                <div className="panel-actions">
                    <button onClick={onExpand} title="Expand"><Icons.Maximize2 size={16} /></button>
                    <button onClick={onRemove} title="Remove" className="remove-btn"><Icons.X size={16} /></button>
                </div>
            </div>
            <div className="panel-content">
                {children}
            </div>
        </div>
    );
};

export default Panel;
