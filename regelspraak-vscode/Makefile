# Makefile for RegelSpraak VSCode Extension

# Variables
NPM = npm
NODE = node

# Default target
.PHONY: all
all: build test

# Build the LSP server
.PHONY: build
build:
	@echo "Building LSP server..."
	@$(NPM) run build
	@echo "Build complete."

# Run all tests
.PHONY: test
test:
	@echo "Running all tests..."
	@cd /home/yeb/regelspraak-parser/regelspraak-vscode && $(NPM) test
	@echo "Tests complete."

# Run tests with coverage
.PHONY: test-coverage
test-coverage:
	@echo "Running tests with coverage..."
	@$(NPM) run test:coverage
	@echo "Coverage report generated."

# Run tests in watch mode
.PHONY: test-watch
test-watch:
	@echo "Running tests in watch mode..."
	@$(NPM) run test:watch

# Run simple integration test
.PHONY: test-simple
test-simple:
	@echo "Running simple integration test..."
	@$(NPM) run test:simple
	@echo "Simple test complete."

# Run specific test file
.PHONY: test-file
test-file:
	@echo "Running test file: $(FILE)"
	@$(NPM) test -- $(FILE)

# Run specific test suite
.PHONY: test-suite
test-suite:
	@echo "Running test suite: $(SUITE)"
	@$(NPM) test -- -t "$(SUITE)"

# Debug test helpers (JavaScript files for quick debugging)
.PHONY: test-references
test-references:
	@echo "Testing Find References..."
	@$(NODE) test-references.js

.PHONY: test-code-action
test-code-action:
	@echo "Testing Code Actions..."
	@$(NODE) test-code-action.js

.PHONY: test-symbols
test-symbols:
	@echo "Testing Document Symbols..."
	@$(NODE) test-symbols.js

# Clean generated files
.PHONY: clean
clean:
	@echo "Cleaning generated files..."
	@rm -rf dist/
	@rm -rf coverage/
	@rm -rf test/*.js test/*.js.map
	@rm -f test-output.log
	@echo "Clean complete."

# Install dependencies
.PHONY: install
install:
	@echo "Installing dependencies..."
	@$(NPM) install
	@echo "Dependencies installed."

# Help target
.PHONY: help
help:
	@echo "Available targets:"
	@echo "  make build          - Build the LSP server"
	@echo "  make test           - Run all tests"
	@echo "  make test-coverage  - Run tests with coverage report"
	@echo "  make test-watch     - Run tests in watch mode"
	@echo "  make test-simple    - Run simple integration test"
	@echo "  make test-file FILE=<path> - Run specific test file"
	@echo "  make test-suite SUITE=<name> - Run specific test suite"
	@echo "  make test-references - Test Find References (debug)"
	@echo "  make test-code-action - Test Code Actions (debug)"
	@echo "  make test-symbols   - Test Document Symbols (debug)"
	@echo "  make clean          - Clean generated files"
	@echo "  make install        - Install dependencies"
	@echo "  make help           - Show this help message"