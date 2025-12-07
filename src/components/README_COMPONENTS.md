# Components README

This folder contains the UI components that make up the Book Club Dashboard.

Structure
- `SidebarTW.js` - left navigation (UI-only). Accepts `onNavigate` and `onLogout` callbacks.
- `BookCardTW.js` - presentational book card. Pure component; raise events via props.
- `GenreIconTW.js` - small icon card for genres; accepts `onClick`.
- `RecentlyReadCardTW.js` - small progress card used in the right panel.
- `RightPanelTW.js` - right sidebar that displays profile, recently read, wishlist, and daily goal.
- `BookDashboardTW.js` - page-level component that composes the above components.

Integration notes
- Data fetching is centralized in `src/hooks/useDashboardData.js` which uses
  `src/services/api.js` to call the backend. To connect to your API:
  1. Implement endpoints in `src/services/api.js` (adjust `BASE` or set `REACT_APP_API_BASE`).
  2. The hook will consume those functions and provide data to the dashboard.
  3. Keep components presentational (accept props and callback handlers) so
     they remain reusable and easy to test.

Testing & Development
- For local development you can mock the API with a small Express server or
  use MSW (Mock Service Worker) to intercept requests.

Styling
- All components use Tailwind CSS. Customize colors in `tailwind.config.js`.
