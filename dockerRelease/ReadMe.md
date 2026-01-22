# Docker Release Guide

This guide shows how to build and run the RuoYi-Vue backend stack using Docker Compose.

## Contents
- MySQL 8.0 (utf8mb4)
- Redis 7
- RuoYi backend (Spring Boot jar)

## Prerequisites
- Docker Engine + Docker Compose plugin/cli
- JDK + Maven for building the backend jar

## Build Artifacts
From the repository root:

```bash
./dockerRelease/build.sh
```

This builds the backend jar and places it at `dockerRelease/ruoyi-admin.jar`.

## Run (Fresh Deployment)
From `dockerRelease/`:

```bash
docker-compose down -v
docker-compose up -d --build
```

- Backend: http://localhost:8080
- MySQL: localhost:3306 (root/root)
- Redis: localhost:6379

## Initialization Notes
- MySQL data uses a named volume `ruoyimysql-data` so `down -v` fully resets the database.
- Initialization scripts live in `dockerRelease/initdb/` and import SQL from `../sql`.
- If you update SQL, run `docker-compose down -v` to reinitialize.

## Common Commands
- View logs: `docker-compose logs -f ruoyibackend`
- Restart services: `docker-compose restart ruoyibackend`
- Stop all: `docker-compose down`

## Troubleshooting
- If menus show乱码, ensure the database was reinitialized by running `docker-compose down -v`.
- If image pulls fail, check your Docker registry mirror settings.
