# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a RuoYi-Vue based administrative management system (JK管理系统). It uses a Spring Boot + Vue.js frontend-backend separation architecture with JWT authentication.

## Tech Stack

- **Backend**: Java 8, Spring Boot 2.5.15, Spring Security, MyBatis, MySQL, Redis
- **Frontend**: Vue 2.6, Element UI 2.15, Vuex, Vue Router
- **Build**: Maven (backend), npm (frontend)
- **Auth**: JWT tokens with Spring Security

## Module Architecture

```
ruoyi-admin      → Main entry point (Spring Boot app, controllers, config)
ruoyi-framework  → Core infrastructure (security, config, aspects, interceptors)
ruoyi-system     → System domain layer (domain entities, mappers, services)
ruoyi-common     → Shared utilities (annotations, constants, utils, exceptions)
ruoyi-quartz     → Scheduled task management
ruoyi-generator  → Code generator for CRUD operations
ruoyi-ui         → Vue 2 frontend (views, components, store, router)
```

**Module Dependencies**: admin → framework → system → common

## Build & Run Commands

### Backend
```bash
# Build all modules (from repo root)
mvn clean package -Dmaven.test.skip=true

# Output: ruoyi-admin/target/ruoyi-admin.jar

# Run on Linux/macOS
./ry.sh start|stop|restart|status

# Run on Windows
bin\run.bat

# Or run directly
java -jar ruoyi-admin/target/ruoyi-admin.jar
```

### Frontend (from ruoyi-ui/)
```bash
npm install           # Install dependencies
npm run dev           # Dev server at http://localhost:80
npm run build:prod    # Production build
npm run build:stage   # Staging build
```

### Database Setup
- SQL scripts are in `sql/`
- Main schema: `sql/ry_20250522.sql`
- Quartz tables: `sql/quartz.sql`

## Configuration Files

- `ruoyi-admin/src/main/resources/application.yml` - Main config (server port, Redis, token settings)
- `ruoyi-admin/src/main/resources/application-druid.yml` - Database connection config
- `ruoyi-ui/vue.config.js` - Frontend dev server and proxy config

## Code Patterns

### Backend Layer Structure
- **Controller**: `ruoyi-admin/src/main/java/com/ruoyi/web/controller/`
- **Service**: `ruoyi-system/src/main/java/com/ruoyi/system/service/`
- **Mapper Interface**: `ruoyi-system/src/main/java/com/ruoyi/system/mapper/`
- **Mapper XML**: `ruoyi-system/src/main/resources/mapper/`
- **Domain Entity**: `ruoyi-system/src/main/java/com/ruoyi/system/domain/`

### Adding a New Feature
1. Create domain entity in `ruoyi-system/domain/`
2. Create mapper interface in `ruoyi-system/mapper/`
3. Create mapper XML in `ruoyi-system/resources/mapper/`
4. Create service interface and impl in `ruoyi-system/service/`
5. Create controller in `ruoyi-admin/web/controller/`
6. Add frontend views in `ruoyi-ui/src/views/`
7. Add API calls in `ruoyi-ui/src/api/`

### Frontend Structure
- `src/views/` - Page components (system, monitor, tool modules)
- `src/components/` - Reusable components
- `src/api/` - API request definitions
- `src/store/` - Vuex state management
- `src/router/` - Vue Router configuration

## Code Style

- Java: 4-space indentation, standard Spring conventions
- Vue/JS: 2-space indentation
- Package naming: `com.ruoyi.*`
- MyBatis mapper XMLs: `*Mapper.xml` pattern

## API Documentation

Swagger UI is available at `/swagger-ui/index.html` when `swagger.enabled: true` (default).

## Key Backend Utilities

- `ruoyi-common/utils/` - Common utilities (DateUtils, StringUtils, SecurityUtils, etc.)
- `ruoyi-common/core/domain/AjaxResult` - Standard API response wrapper
- `ruoyi-common/core/page/TableDataInfo` - Paginated response wrapper
- `@Log` annotation - Logs operations to `sys_oper_log` table
- `@RepeatSubmit` annotation - Prevents duplicate form submissions

## Testing

No automated test suites exist in this repository. Tests can be added to `src/test/java` following standard Maven conventions.