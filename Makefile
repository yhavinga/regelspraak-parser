# Makefile for RegelSpraak Parser

# Variables
PYTHON = python
PROJECT_ROOT = $(shell git rev-parse --show-toplevel)
ANTLR4 = java -jar $(PROJECT_ROOT)/lib/antlr-4.13.1-complete.jar
PARSER_OUT_DIR = src/regelspraak/_antlr
TS_PARSER_OUT_DIR = typescript/src/generated/antlr
GRAMMAR_DIR = grammar
TEST_DIR = tests

# Default target
.PHONY: all
all: parser test

# Target to generate ANTLR parser files for both Python and TypeScript
.PHONY: parser
parser: parser-python parser-ts parser-java
	@echo "All parsers generated successfully."

# Target to generate Python parser files
.PHONY: parser-python
parser-python:
	@echo "Cleaning existing Python parser files..."
	@rm -rf $(PARSER_OUT_DIR)
	@echo "Generating ANTLR Python parser files..."
	@mkdir -p $(PARSER_OUT_DIR)
	@cd $(GRAMMAR_DIR) && \
	$(ANTLR4) -Dlanguage=Python3 \
	          -visitor -listener \
	          -package regelspraak._antlr \
	          -o ../$(PARSER_OUT_DIR) \
	          RegelSpraakLexer.g4 RegelSpraak.g4 && \
	cd ..
	@echo "Python parser generation complete."

# Target to generate TypeScript parser files
.PHONY: parser-ts
parser-ts:
	@echo "Cleaning existing TypeScript parser files..."
	@rm -rf $(TS_PARSER_OUT_DIR)
	@echo "Generating ANTLR TypeScript parser files..."
	@mkdir -p $(TS_PARSER_OUT_DIR)
	@cd $(GRAMMAR_DIR) && \
	$(ANTLR4) -Dlanguage=TypeScript \
	          -visitor -listener \
	          -o ../$(TS_PARSER_OUT_DIR) \
	          RegelSpraakLexer.g4 RegelSpraak.g4 && \
	cd ..
	@echo "TypeScript parser generation complete."

# Target to generate Java parser files for grun debugging
.PHONY: parser-java
parser-java:
	@echo "Generating Java parser files for grun debugging..."
	@cd $(GRAMMAR_DIR) && \
	$(ANTLR4) RegelSpraakLexer.g4 RegelSpraak.g4 && \
	javac -cp ../lib/antlr-4.13.1-complete.jar *.java && \
	cd ..
	@echo "Java parser generation and compilation complete. Ready for grun debugging."

# Target to run unit tests
# Usage: make test                    # Run all tests
#        make test ARGS=test_timeline  # Run specific test module
#        make test ARGS="tests.test_regel.TestRegelParsing.test_regel_met_indien"  # Run specific test
.PHONY: test
test:
	@echo "Running unit tests..."
	@if [ -z "$(ARGS)" ]; then \
		PYTHONPATH=src $(PYTHON) -m unittest discover -s $(TEST_DIR); \
	else \
		PYTHONPATH=src $(PYTHON) -m unittest $(ARGS) -v; \
	fi
	@echo "Tests complete."

# Target to run TypeScript tests
.PHONY: test-ts
test-ts:
	@echo "Running TypeScript tests..."
	@cd typescript && npm test -- $(ARGS)
	@echo "TypeScript tests complete."

# Target to clean generated files and cache
.PHONY: clean
clean:
	@echo "Cleaning generated files and cache..."
	@rm -rf $(PARSER_OUT_DIR)
	@rm -rf src/regelspraak/__pycache__
	@find . -type d -name '__pycache__' -exec rm -rf {} + 
	@find . -type f -name '*.pyc' -delete
	@echo "Clean complete." 