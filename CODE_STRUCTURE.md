Project Code Structure (clean & readable)
========================================

Top-level folders (current):

- src/components: Presentational UI pieces (pure where possible). Add small barrels per area if helpful.
- src/pages: Page-level containers that compose components and handle routing/layout.
- src/services: API wrappers and network logic. Keep environment constants in `src/config/`.
- src/hooks: Reusable data-fetching and state hooks.
- src/data: Static seeds/fixtures.
- src/styles: CSS that is not co-located (keep minimal; prefer Tailwind classes).
- src/types.ts: Shared domain types.
- src/config: API/base URLs and environment-derived constants.

Conventions
- Keep data fetching and mutations inside hooks/services, not inside presentational components.
- Co-locate tiny CSS next to components; otherwise keep in `src/styles`.
- Prefer barrel files for smoother imports: `import { BookCard, Sidebar } from '../components';`

Next steps to further clean codebase
- Add a linter/formatter configuration (.eslintrc, .prettierrc).
- Add unit tests for hooks (Jest + RTL) and snapshots for critical components.
