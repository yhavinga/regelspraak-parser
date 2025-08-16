# Makefile for TypeScript RegelSpraak Parser

.PHONY: all build test clean lint typecheck install help

# Default target
all: build

# Install dependencies
install:
	npm install

# Build the TypeScript project
build:
	npm run build

# Run all tests
test:
	npm test

# Run specific test file or pattern
# Usage: make test-file FILE=tests/timeline/timeline-basic.test.ts
test-file:
	npm test -- $(FILE)

# Run tests in watch mode
test-watch:
	npm run test:watch

# Clean build artifacts
clean:
	npm run clean
	rm -rf dist/
	rm -rf node_modules/
	rm -f .tsbuildinfo

# Run linter
lint:
	npm run lint

# Run type checking
typecheck:
	npm run typecheck

# Check module sizes
check-size:
	npm run check-size

# Development build (no size check)
dev-build:
	npx tsc

# Extract multiword keywords
extract-keywords:
	npm run prebuild

# Build for browser
build-browser:
	npm run build:browser

# Full rebuild (clean + install + build)
rebuild: clean install build

# Run quality checks (lint + typecheck + test)
quality: lint typecheck test

# Help target
help:
	@echo "Available targets:"
	@echo "  make install      - Install npm dependencies"
	@echo "  make build        - Build the TypeScript project"
	@echo "  make test         - Run all tests"
	@echo "  make test-file FILE=<path> - Run specific test file"
	@echo "  make test-watch   - Run tests in watch mode"
	@echo "  make clean        - Clean build artifacts"
	@echo "  make lint         - Run ESLint"
	@echo "  make typecheck    - Run TypeScript type checking"
	@echo "  make check-size   - Check module sizes"
	@echo "  make dev-build    - Development build (no size check)"
	@echo "  make rebuild      - Full rebuild (clean + install + build)"
	@echo "  make quality      - Run all quality checks"
	@echo "  make help         - Show this help message"