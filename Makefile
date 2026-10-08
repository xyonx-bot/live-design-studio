# Run the backend unit suite in the same Python image as production
# (python:3.12-slim, mirrors backend/Dockerfile).
.PHONY: test test-back test-e2e

test: test-back

test-back:
	./backend/run-tests.sh

test-e2e:
	python3 scripts/e2e-smoke.py
