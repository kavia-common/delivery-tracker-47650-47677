import React from 'react';
import './App.css';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import ShipmentStatusList from './components/ShipmentStatusList';
import NotificationsPanel from './components/NotificationsPanel';
import ShipmentDetail from './components/ShipmentDetail';

// PUBLIC_INTERFACE
function App() {
  /**
   * Delivery Tracker App root, wiring providers and the main responsive layout.
   * Ocean Professional theme with subtle gradient background.
   */
  return (
    <AppProvider>
      <div className="ocean-app">
        <div className="ocean-gradient" />
        <Header />
        <main className="layout">
          <section className="main-content" aria-label="Shipment status list">
            <ShipmentStatusList />
          </section>
          <aside className="side-panel" aria-label="Notifications and live updates">
            <NotificationsPanel />
          </aside>
        </main>
        <ShipmentDetail />
      </div>
    </AppProvider>
  );
}

export default App;
