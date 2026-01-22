# Repository Guidelines

## Project Structure & Module Organization
- `ruoyi-admin`: Spring Boot entry module (controllers, resources, app config).
- `ruoyi-framework`, `ruoyi-common`, `ruoyi-system`, `ruoyi-quartz`, `ruoyi-generator`: core backend modules (security, shared utilities, system domain, scheduling, code gen).
- `ruoyi-ui`: Vue 2 + Element UI frontend (views, components, store, router).
- `sql`: schema and seed scripts (e.g., `sql/ry_20250522.sql`).
- `bin`, `ry.sh`, `ry.bat`: helper scripts for packaging and running.

## Build, Test, and Development Commands
Backend (from repo root):
- `mvn clean package -Dmaven.test.skip=true`: build all modules and produce `ruoyi-admin/target/ruoyi-admin.jar`.
- `bin/run.bat`: run the built backend jar on Windows.
- `./ry.sh start|stop|restart|status`: manage the backend jar on Linux/macOS.

Frontend (from `ruoyi-ui`):
- `npm install`: install dependencies.
- `npm run dev`: start the dev server (default http://localhost:80).
- `npm run build:stage` / `npm run build:prod`: build for staging or production.

## Coding Style & Naming Conventions
- Java: follow standard Spring Boot conventions; keep classes in `com.ruoyi.*` packages.
- MyBatis mappers: XML in `*/resources/mapper/**`, interfaces in `*/mapper/**`.
- Vue: single-file components in `ruoyi-ui/src/views` and `ruoyi-ui/src/components`.
- Indentation: 4 spaces for Java, 2 spaces for JS/Vue/JSON; keep files in LF.

## Testing Guidelines
- No automated test suites are present in this repo.
- If you add tests, document the command and location (e.g., `src/test/java`).

## Commit & Pull Request Guidelines
- Commits are short, descriptive phrases (currently in Chinese). Keep them concise and scoped.
- PRs should include: purpose, key changes, testing performed, and screenshots for UI changes.
- Link related issues or requirements when available.

## Configuration & Data
- Backend config lives in `ruoyi-admin/src/main/resources/application.yml` and `application-druid.yml`.
- Initial database setup uses scripts in `sql/`.
