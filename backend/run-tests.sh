#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
docker run --rm -e GIT_PYTHON_REFRESH=quiet -v "$PWD":/app -w /app python:3.12-slim sh -c \
  "apt-get -qq update >/dev/null && apt-get -qq install -y git >/dev/null && \
   pip -q install -r requirements.txt pytest pytest-asyncio >/dev/null && \
   python -m pytest -q"
