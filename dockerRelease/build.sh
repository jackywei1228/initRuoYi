#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
ROOT_DIR=$(cd "${SCRIPT_DIR}/.." && pwd)

mvn -f "${ROOT_DIR}/pom.xml" clean package -Dmaven.test.skip=true

JAR_SRC="${ROOT_DIR}/ruoyi-admin/target/ruoyi-admin.jar"
JAR_DEST="${SCRIPT_DIR}/ruoyi-admin.jar"

if [ ! -f "${JAR_SRC}" ]; then
  echo "Backend jar not found at ${JAR_SRC}" >&2
  exit 1
fi

cp "${JAR_SRC}" "${JAR_DEST}"

mkdir -p "${SCRIPT_DIR}/initdb"

echo "Artifacts prepared under ${SCRIPT_DIR}"
