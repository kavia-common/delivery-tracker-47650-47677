const BASE_URL = getApiBaseUrl();

/**
 * PUBLIC_INTERFACE
 * getApiBaseUrl returns the API base from env (REACT_APP_API_BASE or REACT_APP_BACKEND_URL).
 * If both are missing, returns an empty string so the app can show a configuration banner.
 */
export function getApiBaseUrl() {
  const base = process.env.REACT_APP_API_BASE || process.env.REACT_APP_BACKEND_URL || '';
  return (base || '').replace(/\/+$/, '');
}

/**
 * PUBLIC_INTERFACE
 * getWsUrl returns the websocket URL from env (REACT_APP_WS_URL) if provided, otherwise empty string.
 */
export function getWsUrl() {
  return process.env.REACT_APP_WS_URL || '';
}

/**
 * PUBLIC_INTERFACE
 * apiClient: minimal client for shipment search and live updates.
 */
export const apiClient = {
  /**
   * PUBLIC_INTERFACE
   * getShipmentByTracking fetches shipment by tracking number. If BASE_URL is not set,
   * it returns a mocked response for UI demonstration.
   */
  async getShipmentByTracking(trackingNumber) {
    if (!BASE_URL) {
      // Mocked data to allow UI demonstration when backend is not configured
      await sleep(400);
      return mockShipment(trackingNumber);
    }
    const url = `${BASE_URL}/shipments/${encodeURIComponent(trackingNumber)}`;
    const res = await fetch(url);
    if (!res.ok) {
      const txt = await res.text().catch(() => '');
      throw new Error(txt || `Failed to fetch: ${res.status}`);
    }
    return res.json();
  },

  /**
   * PUBLIC_INTERFACE
   * getLiveUpdates tries to open a WebSocket and return it. If REACT_APP_WS_URL is not set,
   * callers should fall back to polling. The socket sends/receives JSON messages.
   */
  getLiveUpdates(trackingNumber) {
    const wsUrl = getWsUrl();
    if (!wsUrl) throw new Error('No WS URL');
    const url = wsUrl.includes('?') ? `${wsUrl}&tn=${encodeURIComponent(trackingNumber)}` : `${wsUrl}?tn=${encodeURIComponent(trackingNumber)}`;
    const ws = new WebSocket(url);
    // Optionally send a subscribe message once open
    ws.onopen = () => {
      try {
        ws.send(JSON.stringify({ action: 'subscribe', trackingNumber }));
      } catch {}
    };
    return ws;
  }
};

function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

function mockShipment(trackingNumber) {
  const now = new Date();
  const locations = ['Origin Facility', 'Transit Hub A', 'Transit Hub B', 'Local Facility', 'Out for Delivery'];
  const idx = Math.min(Math.floor((now.getMinutes() % locations.length)), locations.length - 1);
  const statusMap = ['Label Created', 'In Transit', 'In Transit', 'Arrived at Facility', 'Out for Delivery', 'Delivered'];
  const status = statusMap[Math.min(idx + 1, statusMap.length - 1)];

  return {
    trackingNumber,
    carrier: 'MockCarrier',
    status,
    eta: new Date(now.getTime() + 36 * 3600 * 1000).toISOString(),
    location: locations[idx],
    service: 'Ground',
    weight: '2.4 kg',
    history: [
      { time: new Date(now.getTime() - 72 * 3600 * 1000).toISOString(), location: 'Origin Facility', status: 'Label Created' },
      { time: new Date(now.getTime() - 48 * 3600 * 1000).toISOString(), location: 'Transit Hub A', status: 'Departed Facility' },
      { time: new Date(now.getTime() - 24 * 3600 * 1000).toISOString(), location: 'Transit Hub B', status: 'Arrived at Facility' },
    ],
  };
}
