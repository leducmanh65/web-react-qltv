TypeScript Status
=================

The project is now fully TypeScript (no JS sources). The previous `src/ts/` examples and `_js_backups/` have been removed to keep the tree clean.

If you need to adjust compiler strictness, edit `tsconfig.json` (e.g., turn on `strict` or disable `allowJs`).

Dev tips
- Run `npm start` for development; `npm run build` for production bundles.
- Keep shared types in `src/types.ts` and API/base URLs in `src/config/`.
- Prefer keeping data fetching inside `src/hooks` or `src/services` and pass typed props to presentational components.
