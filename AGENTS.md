# AGENTS.md
Repository guide for agentic coding assistants working in this project.

## 1) Project Layout
- Root orchestrates backend and frontend with npm `--prefix` scripts.
- `backend/`: Express + TypeScript + Mongoose + Firebase Admin.
- `frontend2/`: React + Vite + TypeScript + Redux Toolkit + Mantine + shadcn/ui.
- `readme.md`: deployment and environment variable reference.

## 2) Tooling and Package Manager
- Package manager: `npm` (lockfiles are `package-lock.json`).
- Do not switch to pnpm/yarn unless explicitly requested.
- Node version is not pinned in repo; use current LTS unless task requires otherwise.

## 3) Install Commands
- Install all dependencies: `npm install`
- Install backend only: `npm install --prefix backend`
- Install frontend only: `npm install --prefix frontend2`

## 4) Run Commands (Dev/Prod)
- Run both apps (root): `npm run dev`
- Backend dev only: `npm run dev --prefix backend`
- Frontend dev only: `npm run dev --prefix frontend2`
- Build backend: `npm run build --prefix backend`
- Start backend from build output: `npm run start --prefix backend`
- Build frontend: `npm run build --prefix frontend2`
- Preview frontend build: `npm run preview --prefix frontend2`

## 5) Lint and Typecheck Commands
Current repo state:
- Frontend has ESLint config at `frontend2/eslint.config.js`.
- Frontend package has no `lint` script.
- Backend has TypeScript config but no ESLint setup.

Use these validation commands:
- Frontend lint: `npx eslint "frontend2/src/**/*.{ts,tsx}"`
- Frontend typecheck: `npx tsc --noEmit -p frontend2/tsconfig.app.json`
- Backend typecheck/build: `npm run build --prefix backend`

## 6) Test Commands (Important)
Current repo state:
- No automated test runner is configured in scripts.
- No Jest/Vitest config files were found.
- No `test` script exists in root, backend, or frontend `package.json`.

What agents should do now:
- If asked to run tests, report that tests are not configured.
- Use lint + typecheck + build as the validation baseline.

Single-test guidance for future setup:
- If Vitest is added:
  - `npx vitest run path/to/file.test.ts`
  - `npx vitest run -t "test name"`
- If Jest is added:
  - `npx jest path/to/file.test.ts`
  - `npx jest -t "test name"`

## 7) Environment and Runtime Notes
- Backend default port is `3001`.
- Frontend Vite dev server port is `5173`.
- Frontend dev proxy maps `/api` and `/uploads` to `http://localhost:3001`.
- Backend serves static uploads from `UPLOADS_DIR` at `/uploads`.
- CORS origins come from `CORS_ORIGINS` (comma-separated) with safe defaults.

## 8) Import Conventions
Follow local conventions:
- Use ES module imports in frontend and backend TypeScript files.
- Prefer double quotes for TypeScript/TSX strings and imports.
- Keep semicolons.
- Group imports in this order when practical:
  1. external libraries
  2. internal absolute/alias imports
  3. internal relative imports
  4. type-only imports (or inline `type` qualifier)
- Frontend alias `@/` resolves to `frontend2/src`.
- Backend uses relative imports (no backend alias configured).

## 9) Formatting and File Hygiene
- Keep existing style; do not introduce a new formatter style in isolated edits.
- Prefer concise functions and early returns.
- Avoid debug logs in final code.
- Avoid large commented-out blocks.
- Keep changes scoped; avoid unrelated refactors.

## 10) TypeScript Guidelines
- Frontend and backend are configured in strict mode.
- Prefer explicit interfaces/types for payloads, DTOs, and Redux state.
- Avoid `any`; if unavoidable, keep it localized and justify it.
- Use `unknown` for caught errors and narrow before use.
- Prefer `import type` where appropriate.
- In async thunks, use `rejectWithValue` with `string` user-facing errors.

## 11) Naming Conventions
- React components: `PascalCase` file and symbol names.
- Hooks: `useXxx`.
- Redux slices: `xxxSlice.ts` plus exported selectors.
- Async thunks: verb-first names (`getAllUsers`, `updateUserProfile`).
- Backend controllers: camelCase function names, exported as object default.
- Validators: arrays ending with `...Validator`.
- Enums: `PascalCase` enum names and members.

## 12) Backend API and Error Handling
Use established backend patterns:
- Validate request input with `express-validator` middleware before controllers.
- Authentication is Firebase bearer token middleware.
- For expected failures, return consistent JSON payloads and status codes.
- Prefer shared helper `handleHttpError(res, message, code, error?)` where used.
- Use 401 for auth issues, 403 for role/ownership issues, 404 for missing resources.
- Keep controller logic in `try/catch`; do not leak raw stack traces.

## 13) Frontend Data and Error Handling
Use established frontend patterns:
- API calls go through `frontend2/src/config/axios.ts` (`axiosPrivate`).
- Let axios interceptors attach Firebase/local token automatically.
- In thunks/services, catch `isAxiosError` and normalize safe messages.
- Use `rejectWithValue` for thunk failures and surface message in slice state.
- Keep user feedback through existing toast stack (`sonner`).

## 14) Validation and Domain Rules
- Frontend forms use Zod schemas in `frontend2/src/zodValidations`.
- Backend request validation uses `express-validator` files under route folders.
- Keep frontend and backend validation aligned when payload contracts change.
- Preserve null/empty-string normalization behavior for optional numeric/date fields.

## 15) Architecture and Routing Notes
- Backend API is mounted under `/api`.
- Frontend uses React Router with role-based navigation/guards.
- Redux Toolkit is the main global state pattern.
- Keep feature-oriented structure (`features`, `pages`, `components`, `utils`).

## 16) Cursor/Copilot Rule Files
Checked locations requested by user:
- `.cursor/rules/`: not present.
- `.cursorrules`: not present.
- `.github/copilot-instructions.md`: not present.

If these files are added later, treat them as highest-priority repository instructions.

## 17) Agent Execution Checklist
Before opening a PR or finishing substantial work:
1. Run relevant build/typecheck commands for touched areas.
2. Run frontend ESLint directly (`npx eslint ...`).
3. Verify no secrets or env values were committed.
4. Keep changes scoped to task intent.
5. Note missing test coverage due to absent test framework.
