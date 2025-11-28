import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

/**
 * PUBLIC_INTERFACE
 * ShipmentStatusList shows the list of found shipments and their current status.
 */
export default function ShipmentStatusList() {
  const { shipments, loading, error, setSelectedShipment } = useContext(AppContext);

  if (loading) return <div className="card loading">Loading shipments…</div>;
  if (error) return <div className="card error">Error: {error}</div>;
  if (!shipments || shipments.length === 0) {
    return <div className="card empty">Search for a tracking number to see shipment status.</div>;
  }

  return (
    <div className="card shipments" role="list">
      <div className="section-title">Shipments</div>
      {shipments.map((s) => {
        const tn = s.trackingNumber || s.id || 'N/A';
        const status = (s.status || 'in_transit').toLowerCase().replace(/\s+/g, '-');
        const pillClass = {
          'in-transit': 'status-in-transit',
          'out-for-delivery': 'status-out-for-delivery',
          delivered: 'status-delivered',
          exception: 'status-exception',
        }[status] || 'status-in-transit';

        return (
          <div
            key={tn}
            className="shipment-item"
            role="listitem"
            onClick={() => setSelectedShipment(s)}
            aria-label={`Shipment ${tn} - ${s.status || 'In transit'}`}
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter') setSelectedShipment(s); }}
          >
            <div>
              <div className="shipment-title">{tn}</div>
              <div className="shipment-meta">
                <span>Carrier: {s.carrier || 'Unknown'}</span>
                <span>ETA: {s.eta || '—'}</span>
                <span>Location: {s.location || '—'}</span>
              </div>
            </div>
            <div className={`status-pill ${pillClass}`}>
              {s.status || 'In transit'}
            </div>
          </div>
        );
      })}
    </div>
  );
}
