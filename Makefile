# Makefile for RegelSpraak Parser

# Variables
PYTHON = python
PROJECT_ROOT = $(shell git rev-parse --show-toplevel)
ANTLR4 = java -jar $(PROJECT_ROOT)/lib/antlr-4.13.1-complete.jar
PARSER_OUT_DIR = src/regelspraak/_antlr
GRAMMAR_DIR = grammar
TEST_DIR = tests

# Default target
.PHONY: all
all: parser test

# Target to generate ANTLR parser files
.PHONY: parser
parser:
	@echo "Cleaning existing parser files..."
	@rm -rf $(PARSER_OUT_DIR)
	@echo "Generating ANTLR parser files..."
	@mkdir -p $(PARSER_OUT_DIR)
	@cd $(GRAMMAR_DIR) && \
	$(ANTLR4) -Dlanguage=Python3 \
	          -visitor -listener \
	          -package regelspraak._antlr \
	          -o ../$(PARSER_OUT_DIR) \
	          RegelSpraakLexer.g4 RegelSpraak.g4 && \
	cd ..
	@echo "Parser generation complete."

# Target to run unit tests
.PHONY: test
test:
	@echo "Running unit tests..."
	$(PYTHON) -m unittest discover -s $(TEST_DIR)
	@echo "Tests complete."

# Target to clean generated files and cache
.PHONY: clean
clean:
	@echo "Cleaning generated files and cache..."
	@rm -rf $(PARSER_OUT_DIR)
	@rm -rf src/regelspraak/__pycache__
	@find . -type d -name '__pycache__' -exec rm -rf {} + 
	@find . -type f -name '*.pyc' -delete
	@echo "Clean complete." 