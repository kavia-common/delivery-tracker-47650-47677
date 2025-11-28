import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

/**
 * PUBLIC_INTERFACE
 * NotificationsPanel shows recent update notes (from live updates or polling).
 */
export default function NotificationsPanel() {
  const { notifications } = useContext(AppContext);

  return (
    <div className="card side-panel">
      <div className="panel-inner">
        <div className="section-title">Notifications</div>
        {(!notifications || notifications.length === 0) && (
          <div className="empty">No updates yet. Start tracking to receive live updates.</div>
        )}
        {notifications.map(n => (
          <div className="notification-item" key={n.id}>
            <div style={{ fontWeight: 700 }}>{n.title || 'Update'}</div>
            <div className="note-time">{formatTime(n.time)}</div>
            <div>{n.message}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function formatTime(t) {
  try {
    const d = new Date(t);
    return d.toLocaleString();
  } catch {
    return t || '';
  }
}
