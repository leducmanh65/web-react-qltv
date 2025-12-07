# Components README

This folder contains the UI components that make up the Book Club Dashboard.

Structure

- `books/`
  - `BookDashboardTW.tsx` - page-level dashboard (Tailwind)
  - `BookCardTW.tsx` / `BookCard.tsx` - presentational cards
  - `GenreIconTW.tsx`, `RecentlyReadCardTW.tsx`, `BookDashboard.css`
- `borrow/`
  - `BorrowModal.tsx`, `BorrowCart.tsx`
- `layout/`
  - `SidebarTW.tsx`, `Sidebar.tsx`, `RightPanelTW.tsx`, `RightProfilePanel.tsx`, `TopNavbar.tsx`, `MainLayout.tsx`, `SearchBar.tsx`
  - co-located styles: `MainLayout.css`, `TopNavbar.css`
- `profile/`
  - `UserProfile.tsx` (+ `UserProfile.css`)
- `shared/`
  - `StatusBadge.tsx`

Integration notes
- Data fetching is centralized in `src/hooks/useDashboardData.ts` and `src/services/api.ts`.
- Keep presentational components dumb; lift side effects into hooks/services.

Testing & Development
- For local development you can mock the API with a small Express server or
  use MSW (Mock Service Worker) to intercept requests.

Styling
- All components use Tailwind CSS. Customize colors in `tailwind.config.js`.
