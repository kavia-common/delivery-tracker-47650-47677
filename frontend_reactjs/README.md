# Delivery Tracker - Ocean Professional Frontend

This app provides a modern, responsive UI to track deliveries, view shipment status, and see real-time updates.

## Quick Start

- `npm start` — runs at http://localhost:3000
- `npm test` — run tests
- `npm run build` — production build

## Configuration

The UI reads base URLs from environment variables:
- `REACT_APP_API_BASE` or `REACT_APP_BACKEND_URL` — REST API base URL (e.g., https://api.example.com)
- `REACT_APP_WS_URL` — WebSocket URL for live updates (e.g., wss://api.example.com/ws/updates)

If these are not set, the app displays a configuration notice and uses mocked data for demo.

Create a `.env` file (do not commit credentials):
```
REACT_APP_API_BASE=https://api.example.com
REACT_APP_WS_URL=wss://api.example.com/ws/updates
```

Other supported env vars in this container:
- REACT_APP_FRONTEND_URL
- REACT_APP_NODE_ENV
- REACT_APP_NEXT_TELEMETRY_DISABLED
- REACT_APP_ENABLE_SOURCE_MAPS
- REACT_APP_PORT
- REACT_APP_TRUST_PROXY
- REACT_APP_LOG_LEVEL
- REACT_APP_HEALTHCHECK_PATH
- REACT_APP_FEATURE_FLAGS
- REACT_APP_EXPERIMENTS_ENABLED

## Theme

Ocean Professional: primary #2563EB, secondary #F59E0B, error #EF4444, background #f9fafb, surface #ffffff, text #111827, with subtle gradient background and soft shadows.

## UI Layout

- Top Header with tracking number search
- Main: Shipments list with statuses
- Right Side: Notifications/updates
- Detail Drawer: Click a shipment to see details and history
