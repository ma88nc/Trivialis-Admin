<!-- Guidance for AI coding agents working on ng-trivialis-so -->
# Quick repo summary
- Purpose: small Angular (v20) TypeScript single-page app for managing trivia questions.
- Project layout: see `src/app/` — components, `services/`, and `models/` are co-located under that folder.

# What matters (architecture & patterns)
- Standalone Angular components (no NgModule): components import router/outlet directly (see `src/app/app.ts`).
- App bootstrap uses `appConfig` providers in `src/app/app.config.ts` (router + http client + global error listeners).
- Routing is declared in `src/app/app.routes.ts` — routes are component -> path mappings (e.g. `'' => Welcome`, `'admin' => QuestionMaintenance`).
- HTTP and state patterns:
  - Services use `inject(HttpClient)` and `httpResource` (see `src/app/services/question.service.ts`).
  - API base URL is hard-coded in services (e.g. `private baseUrl = 'https://localhost:7073/api/';`).
  - RxJS `pipe` + `catchError` is used; error handler returns `throwError`.
- Models are plain TypeScript interfaces under `src/app/models/` (e.g. `Question` in `question.ts`).
- UI templates and styles live alongside components as `.html`/`.css` files (e.g. `src/app/welcome.html`, `src/app/app.css`).

# Developer workflows (concrete commands)
- Start dev server (hot reload): `npm start` (runs `ng serve`).
- Build: `npm run build` (runs `ng build`).
- Watch build (dev build watch): `npm run watch`.
- Run unit tests (Karma + Jasmine): `npm test`.

# Project-specific conventions and notes for edits
- Keep component templates/styles as separate files (existing pattern). Mirror naming: `foo.ts`, `foo.html`, `foo.css`.
- Services:
  - Use dependency injection via `inject(...)` rather than constructor where present.
  - Use `httpResource<T>(() => url, { defaultValue: [...] })` for resource-backed reactive data when appropriate.
  - Update the `baseUrl` in a specific service when adding new endpoints; there's no central environment file in this repo.
- Routing: add new routes to `src/app/app.routes.ts`. Use the same component-class objects (not strings).
- Types: models are interfaces (e.g. `Question`) — keep fields nullable/optional as current patterns (many fields use `| undefined` or `| null`).

# Integration & external deps
- Angular v20 core packages (see `package.json`) and `@angular/cli` for local dev.
- ag-grid and ngx-bootstrap are included for grid/UI widgets.
- Backend: services point to `https://localhost:7073/api/` by default; tests or local runs may need a mock backend or a running API on that port.

# Examples to copy/paste
- Add a route:
  - Edit `src/app/app.routes.ts`, add: `{ path: 'my', component: MyComponent }` and create `MyComponent` alongside other components.
- Call POST endpoint from `QuestionService`: see `postQuestion(question: Question)` in `src/app/services/question.service.ts`.

# What NOT to change casually
- Do not assume a global env file exists; changing `baseUrl` in one service won't affect others.
- Avoid converting components to NgModules — this repo uses standalone components throughout.

# Useful files to inspect
- `src/app/app.config.ts` — application providers and router registration
- `src/app/app.routes.ts` — routing map
- `src/app/services/question.service.ts` — canonical HTTP/service pattern
- `src/app/models/question.ts` — example of data shape

# If you need to run tests or debug failing HTTP calls
- Use `npm test` for unit tests (Karma + Chrome launcher).
- For API debugging, either run the backend at `https://localhost:7073/` or mock network calls in tests; services use `HttpClient` so standard Angular test setup applies.

If anything here is unclear or you'd like more examples (mocking HTTP, adding a new component, or centralizing API URLs), tell me what area to expand and I'll iterate.
