#!/usr/bin/env sh
set -eu

echo "[initdb] start import ruoyi sql files..."

DB_NAME="${MYSQL_DATABASE:-ry-vue}"

run_sql() {
  f="$1"
  if [ ! -f "$f" ]; then
    echo "[initdb] WARN missing: $f"
    return 0
  fi
  echo "[initdb] import: $f"
  mysql --default-character-set=utf8mb4 -uroot -p"${MYSQL_ROOT_PASSWORD}" "${DB_NAME}" < "$f"
}

run_sql /repo-sql/ry_20250522.sql
run_sql /repo-sql/quartz.sql
