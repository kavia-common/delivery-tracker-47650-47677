import React, { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { apiClient, getApiBaseUrl, getWsUrl } from '../services/apiClient';

/**
 * PUBLIC_INTERFACE
 * AppContext provides global state for tracking number, shipment results, selection, loading, errors, and notifications.
 */
export const AppContext = createContext(null);

/**
 * PUBLIC_INTERFACE
 * AppProvider: Wrap your app with this provider to enable delivery tracking state and actions.
 */
export function AppProvider({ children }) {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [shipments, setShipments] = useState([]);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [configNotice, setConfigNotice] = useState('');
  const wsRef = useRef(null);
  const pollRef = useRef(null);

  // Evaluate configuration and show banner if missing
  useEffect(() => {
    const base = getApiBaseUrl();
    if (!base) {
      setConfigNotice('No API base URL configured. Set REACT_APP_API_BASE or REACT_APP_BACKEND_URL to enable live data.');
    } else {
      setConfigNotice('');
    }
  }, []);

  // Clean up sockets and polling on unmount
  useEffect(() => {
    return () => {
      try { if (wsRef.current) wsRef.current.close(); } catch {}
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, []);

  const pushNotification = useCallback((note) => {
    setNotifications((prev) => {
      const next = [{ id: `${Date.now()}-${Math.random()}`, ...note }, ...prev];
      return next.slice(0, 50);
    });
  }, []);

  // PUBLIC_INTERFACE
  const searchByTracking = useCallback(async (tn) => {
    const q = (tn ?? trackingNumber).trim();
    if (!q) {
      setError('Please enter a tracking number.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const data = await apiClient.getShipmentByTracking(q);
      const list = Array.isArray(data) ? data : (data ? [data] : []);
      setShipments(list);
      if (list.length) {
        setSelectedShipment(list[0]);
      } else {
        setSelectedShipment(null);
      }
      // Start live updates for the first item (or exact tracking number)
      startLiveUpdates(q);
    } catch (e) {
      setError(e?.message || 'Failed to fetch shipment.');
      setShipments([]);
      setSelectedShipment(null);
    } finally {
      setLoading(false);
    }
  }, [trackingNumber]);

  const startLiveUpdates = useCallback((tn) => {
    // Cleanup existing
    try { if (wsRef.current) wsRef.current.close(); } catch {}
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }

    const wsUrl = getWsUrl();
    if (wsUrl) {
      try {
        const ws = apiClient.getLiveUpdates(tn);
        wsRef.current = ws;
        ws.onmessage = (evt) => {
          try {
            const msg = JSON.parse(evt.data);
            if (msg.type === 'shipment_update') {
              setShipments((prev) => {
                // naive merge: replace shipment with same trackingNumber
                const idx = prev.findIndex(s => (s.trackingNumber || s.id) === (msg.payload.trackingNumber || msg.payload.id));
                if (idx >= 0) {
                  const copy = prev.slice();
                  copy[idx] = { ...copy[idx], ...msg.payload };
                  return copy;
                }
                return [msg.payload, ...prev].slice(0, 20);
              });
              pushNotification({ title: 'Shipment update', message: msg.payload.status || 'Status updated', time: new Date().toISOString() });
            } else if (msg.type === 'notification') {
              pushNotification({ title: 'Update', message: msg.message, time: new Date().toISOString() });
            }
          } catch {}
        };
        ws.onerror = () => {
          pushNotification({ title: 'Live updates error', message: 'WebSocket error; falling back to polling.', time: new Date().toISOString() });
          try { ws.close(); } catch {}
          setupPolling(tn);
        };
      } catch {
        setupPolling(tn);
      }
    } else {
      setupPolling(tn);
    }
  }, [pushNotification]);

  const setupPolling = useCallback((tn) => {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      try {
        const data = await apiClient.getShipmentByTracking(tn);
        const list = Array.isArray(data) ? data : (data ? [data] : []);
        setShipments(list);
      } catch {
        // silent polling error
      }
    }, 8000);
  }, []);

  const value = useMemo(() => ({
    trackingNumber,
    setTrackingNumber,
    shipments,
    selectedShipment,
    setSelectedShipment,
    notifications,
    loading,
    error,
    configNotice,
    searchByTracking,
  }), [
    trackingNumber, shipments, selectedShipment, notifications, loading, error, configNotice, searchByTracking
  ]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}
