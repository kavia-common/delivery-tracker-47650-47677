import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';

/**
 * PUBLIC_INTERFACE
 * Header component with brand and tracking number search input.
 */
export default function Header() {
  const { trackingNumber, setTrackingNumber, searchByTracking, loading, configNotice } = useContext(AppContext);
  const [local, setLocal] = useState(trackingNumber);

  const onSubmit = (e) => {
    e.preventDefault();
    setTrackingNumber(local);
    searchByTracking(local);
  };

  return (
    <header className="header">
      <div className="header-inner">
        <div className="brand">
          <div className="brand-badge">DT</div>
          Delivery Tracker
        </div>

        <form className="search-bar" onSubmit={onSubmit} role="search" aria-label="Track shipment">
          <input
            className="search-input"
            placeholder="Enter tracking number (e.g., 1Z999AA10123456784)"
            value={local}
            onChange={(e) => setLocal(e.target.value)}
            aria-label="Tracking number"
          />
          <button className="search-btn" type="submit" disabled={loading}>
            {loading ? 'Searching…' : 'Track'}
          </button>
        </form>

        {configNotice ? (
          <div className="config-banner" role="note" aria-live="polite">
            ⚙️ {configNotice}
          </div>
        ) : null}
      </div>
    </header>
  );
}
