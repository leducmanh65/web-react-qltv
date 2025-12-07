import React from 'react';
import '../styles/StatusBadge.css';

export interface StatusBadgeProps {
    status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    const normalized = status.toLowerCase();
    let className = 'status-badge status-badge--neutral';

    if (normalized === 'active') className = 'status-badge status-badge--active';
    if (normalized === 'overdue') className = 'status-badge status-badge--danger';
    if (normalized === 'inactive') className = 'status-badge status-badge--muted';

    return <span className={className}>{status}</span>;
};

export default StatusBadge;
