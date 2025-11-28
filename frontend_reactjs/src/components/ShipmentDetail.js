import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

/**
 * PUBLIC_INTERFACE
 * ShipmentDetail renders a right-side drawer with details of the selected shipment.
 */
export default function ShipmentDetail() {
  const { selectedShipment, setSelectedShipment } = useContext(AppContext);
  const open = !!selectedShipment;

  if (!open) return null;

  const s = selectedShipment;
  const tn = s.trackingNumber || s.id || 'N/A';

  return (
    <div className={`drawer ${open ? 'open' : ''}`} role="dialog" aria-modal="true" aria-label="Shipment details">
      <div className="drawer-header">
        <div style={{ fontWeight: 800 }}>Shipment {tn}</div>
        <button
          onClick={() => setSelectedShipment(null)}
          aria-label="Close details"
          style={{
            border: '1px solid var(--border)',
            background: 'white',
            borderRadius: 8,
            padding: '6px 10px',
            cursor: 'pointer'
          }}
        >
          Close
        </button>
      </div>
      <div className="drawer-body">
        <InfoRow label="Status" value={s.status || 'In transit'} />
        <InfoRow label="Carrier" value={s.carrier || 'Unknown'} />
        <InfoRow label="ETA" value={s.eta || '—'} />
        <InfoRow label="Location" value={s.location || '—'} />
        <InfoRow label="Service" value={s.service || '—'} />
        <InfoRow label="Weight" value={s.weight || '—'} />
        <div style={{ marginTop: 16, fontWeight: 700, color: 'var(--muted)' }}>History</div>
        <ul>
          {(s.history || []).map((h, idx) => (
            <li key={idx}>
              <span style={{ color: 'var(--muted)' }}>{formatTime(h.time)}</span> — {h.location || '—'} — {h.status || 'Updated'}
            </li>
          ))}
          {(!s.history || s.history.length === 0) && <li>No history available.</li>}
        </ul>
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 8, margin: '6px 0' }}>
      <div style={{ color: 'var(--muted)' }}>{label}</div>
      <div>{value}</div>
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
