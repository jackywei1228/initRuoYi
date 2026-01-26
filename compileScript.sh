#!/bin/bash
set -e  # 遇到错误立即退出

VERSION="$(git describe --tags --always 2>/dev/null || echo "unknown")"
echo "[compileScript] version: ${VERSION}"

mvn clean package -Dmaven.test.skip=true
cp -f ruoyi-admin/target/ruoyi-admin.jar ./
echo "[compileScript] built ruoyi-admin.jar (version=${VERSION})"
export ACTIVATION_MASTER_KEY="Qg8Pvt2ghRTG3Rk+DesQDDLzBcN4NNY6RzgKdTcCdKk="
java -jar ruoyi-admin.jar


