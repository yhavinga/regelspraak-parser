# Vision: RegelSpraak - From Rules to Execution and Insight

This document outlines the vision for the `regelspraak-parser` project, showcasing its potential beyond simple parsing towards a comprehensive ecosystem for defining, executing, and understanding rules expressed in the RegelSpraak language.

## Core Component: The RegelSpraak Engine

At its heart, this project provides a Python library capable of:

1.  **Parsing:** Translating RegelSpraak v2.1.0 text (definitions and rules) into an internal representation (e.g., an Abstract Syntax Tree or model objects) using the ANTLR4 grammar.
2.  **Interpretation:** Executing the parsed RegelSpraak rules against provided data (object instances, parameter values) to determine outcomes, calculate values, and assign characteristics according to the defined logic.

This engine forms the foundation for various powerful applications.

## Usage Scenario 1: Interactive Rule Exploration (REPL)

A Command-Line Interface (CLI) providing a Read-Eval-Print Loop (REPL) allows for interactive exploration, definition, and testing of RegelSpraak rules.

**Illustrative Session (TOKA Example):**

```
RegelSpraak Interpreter v0.2.0
Type 'exit' to quit, use '.' on a newline to end multi-line input.

RegelSpraak> # Define an object type from TOKA
RegelSpraak> Objecttype de Natuurlijk persoon (mv: Natuurlijke personen) (bezield)
>>>           is minderjarig kenmerk (bijvoeglijk);
>>>           de leeftijd Numeriek (niet-negatief geheel getal) met eenheid jr;
>>>           de woonprovincie Tekst; # Added for later example
>>>           de woonregio factor Numeriek (geheel getal); # Added for later example
>>>         .
Defined Objecttype: de Natuurlijk persoon

RegelSpraak> # Define a related parameter
RegelSpraak> Parameter de volwassenleeftijd : Numeriek (geheel getal) met eenheid jr;
Defined Parameter: de volwassenleeftijd

RegelSpraak> # Define a simple rule
RegelSpraak> Regel Kenmerktoekenning persoon minderjarig
>>>           geldig altijd
>>>             Een Natuurlijk persoon is minderjarig
>>>             indien zijn leeftijd kleiner is dan de volwassenleeftijd.
>>>         .
Defined Regel: Kenmerktoekenning persoon minderjarig

RegelSpraak> # Use Python context to set up the scenario
RegelSpraak> py: from regelspraak_interpreter import context
RegelSpraak> py: context.set_parameter("volwassenleeftijd", 18, "jr")
Parameter 'volwassenleeftijd' set to 18 jr

RegelSpraak> py: p1 = context.create_instance("Natuurlijk persoon")
RegelSpraak> py: context.set_attribute(p1, "leeftijd", 15, "jr")
Created instance 'p1' of Natuurlijk persoon

RegelSpraak> py: p2 = context.create_instance("Natuurlijk persoon")
RegelSpraak> py: context.set_attribute(p2, "leeftijd", 25, "jr")
Created instance 'p2' of Natuurlijk persoon

RegelSpraak> # Evaluate the rule's effect
RegelSpraak> Evaluate p1 is minderjarig
Evaluating kenmerk 'minderjarig' for p1...
Result: waar

RegelSpraak> Evaluate p2 is minderjarig
Evaluating kenmerk 'minderjarig' for p2...
Result: onwaar

RegelSpraak> # Use a Beslistabel (Assume it's parsed and executable)
RegelSpraak> # (Load from file or define inline if REPL supports it)
RegelSpraak> Load beslistabel ./toka_rules/woonregio.rs # Hypothetical command
Loaded Beslistabel: Woonregio factor

RegelSpraak> py: context.set_attribute(p1, "woonprovincie", "Utrecht")
RegelSpraak> Evaluate p1.woonregio factor
Evaluating attribute 'woonregio factor' for p1...
Result: 3

RegelSpraak> exit
```

*(Note: Commands like `py:`, `Evaluate`, `Load` are part of the REPL interface, not RegelSpraak itself. Instance creation and parameter setting happen via the Python host environment.)*

## Usage Scenario 2: Literate Rule Programming (Jupyter Notebook)

A custom Jupyter Notebook kernel enables "literate programming" for rules: combining Markdown explanations with executable RegelSpraak code cells. The kernel manages the interpreter state across cells, making it ideal for documentation, analysis, and step-by-step development.

**Illustrative Notebook:**

---

### Cell 1: Introduction (Markdown)

```markdown
# TOKA Casus: Belasting en Treinmiles

This notebook defines and tests rules related to the fictional "Treinen Op Korte Afstand" (TOKA) law. We will define passengers, flights, and rules for determining tax liability and train mile allocation.
```

---

### Cell 2: Define Object Types and Core Domain (RegelSpraak)

```regelspraak
# Define necessary domain first
Domein Bedrag is van het type Numeriek (getal met 2 decimalen) met eenheid €

# Now define object types using the domain
Objecttype de Natuurlijk persoon (mv: Natuurlijke personen) (bezield)
    is minderjarig kenmerk (bijvoeglijk);
    het recht op duurzaamheidskorting kenmerk (bezittelijk);
    de leeftijd Numeriek (niet-negatief geheel getal) met eenheid jr;
    de belasting Bedrag; # Uses the Bedrag domain defined above

Objecttype de Reis
    is duurzaam kenmerk (bijvoeglijk);
    de afstand Numeriek (niet-negatief getal) met eenheid km;
```

*(Output of Cell 2)*
```
Defined Domein: Bedrag
Defined Objecttype: de Natuurlijk persoon
Defined Objecttype: de Reis
```

---

### Cell 3: Define Supporting Elements (RegelSpraak)

```regelspraak
# Define parameters
Parameter de volwassenleeftijd : Numeriek (geheel getal) met eenheid jr;
Parameter de duurzaamheidskorting minimale afstand : Numeriek (geheel getal) met eenheid km;
Parameter de basiskorting : Bedrag;

# Define the link between Persoon and Reis
# Note: Units like 'jr', 'km', '€' are assumed to be implicitly defined or loaded.
Feittype vlucht van natuurlijke personen
    de reis Reis # Corrected from Vlucht
    de passagier Natuurlijk persoon
Eén reis betreft de verplaatsing van meerdere passagiers
```

*(Output of Cell 3)*
```
Defined Parameter: de volwassenleeftijd
Defined Parameter: de duurzaamheidskorting minimale afstand
Defined Parameter: de basiskorting
Defined Feittype: vlucht van natuurlijke personen
```

---

### Cell 4: Define Core Rules (RegelSpraak)

```regelspraak
Regel Kenmerktoekenning persoon minderjarig
    geldig altijd
        Een Natuurlijk persoon is minderjarig
        indien zijn leeftijd kleiner is dan de volwassenleeftijd.

Regel Bepaal Duurzaamheidskorting
    geldig altijd
        # Using 'passagier' role to navigate from Persoon to Reis
        Een passagier heeft recht op duurzaamheidskorting
        indien hij aan alle volgende voorwaarden voldoet:
        • zijn reis is duurzaam
        • de afstand van zijn reis is groter of gelijk aan de duurzaamheidskorting minimale afstand.

Regel Bereken Belasting Initieel
    geldig altijd
        De belasting van een passagier moet berekend worden als 500 € min de basiskorting
        indien hij recht op duurzaamheidskorting heeft.
```

*(Output of Cell 4)*
```
Defined Regel: Kenmerktoekenning persoon minderjarig
Defined Regel: Bepaal Duurzaamheidskorting
Defined Regel: Bereken Belasting Initieel
```

---

### Cell 5: Set Up Scenario (Python)

```python
# Interact with the kernel's context
from regelspraak_interpreter import context

# Set parameters
context.set_parameter("volwassenleeftijd", 18, "jr")
context.set_parameter("duurzaamheidskorting minimale afstand", 100, "km")
context.set_parameter("basiskorting", 50, "€")
print("Parameters set.")

# Create instances
reis1 = context.create_instance("Reis")
context.set_attribute(reis1, "afstand", 150, "km")
context.set_kenmerk(reis1, "is duurzaam", True) # Set kenmerk directly
print(f"Created Reis instance: {reis1}")

p1 = context.create_instance("Natuurlijk persoon")
context.set_attribute(p1, "leeftijd", 25, "jr")
context.link(p1, "reis", reis1) # Create the FeitType instance linking p1 and reis1
print(f"Created Natuurlijk persoon instance: {p1}")

p2 = context.create_instance("Natuurlijk persoon")
context.set_attribute(p2, "leeftijd", 15, "jr")
context.link(p2, "reis", reis1)
print(f"Created Natuurlijk persoon instance: {p2}")

```

*(Output of Cell 5)*
```
Parameters set.
Created Reis instance: <Reis object at 0x...>
Created Natuurlijk persoon instance: <Natuurlijk persoon object at 0x...>
Created Natuurlijk persoon instance: <Natuurlijk persoon object at 0x...>
```

---

### Cell 6: Evaluate Rules (RegelSpraak/Command)

```regelspraak
# Check if p2 is minderjarig
Evaluate p2 is minderjarig
```

*(Output of Cell 6)*
```
waar
```

---

### Cell 7: Execute and Evaluate (RegelSpraak/Command)

```regelspraak
# Run relevant rules for p1 to determine tax
Execute Regel Bepaal Duurzaamheidskorting for p1
Execute Regel Bereken Belasting Initieel for p1

# Query the calculated tax
Evaluate p1.belasting
```

*(Output of Cell 7)*
```
Executing Regel Bepaal Duurzaamheidskorting for p1...
Executing Regel Bereken Belasting Initieel for p1...
450.00 €
```

---

## Future Vision 1: Rules as a Service (Backend API)

The RegelSpraak interpreter can be embedded within a web service (e.g., using FastAPI). This allows RegelSpraak models to power backend decision-making processes.

*   **Input:** A request (e.g., JSON) containing data corresponding to the required GegevensSpraak object types and parameters. Pydantic models could be generated from GegevensSpraak definitions for validation.
*   **Processing:** The API endpoint loads the relevant RegelSpraak module (definitions + rules), instantiates the data model from the request, runs the interpreter engine, and executes the rules.
*   **Output:** A response (e.g., JSON) containing the results (calculated attribute values, determined kenmerken, consistency check outcomes).
*   **Discoverability:** An OpenAPI (Swagger) specification can be automatically generated, clearly defining the service's expected inputs and outputs based on the RegelSpraak model.

**Example Use Case:** An online calculator for the TOKA tax. The user inputs flight details and personal information; the API receives this, runs the TOKA RegelSpraak rules, and returns the calculated tax amount.

## Future Vision 2: AI-Enhanced Rule Development and Explainability

Combining the formal, verifiable nature of RegelSpraak with the natural language capabilities of Large Language Models (LLMs) opens exciting possibilities.

### AI-Assisted Rule Authoring

An AI agent, trained on the RegelSpraak syntax and specifications, could assist the 'regelanalist' (rule analyst) by:

*   Translating requirements written in natural language into candidate RegelSpraak definitions and rules.
*   Suggesting refactoring or improvements for clarity and efficiency.
*   Identifying potential ambiguities or contradictions between rules.
*   Generating test scenarios and expected outcomes based on rule logic.

### AI-Powered Explainability

As highlighted in the provided email text, there's a strong need for explainable automated decisions. A hybrid AI approach offers significant advantages:

*   **The RegelSpraak Engine's Role (Certainty & Traceability):**
    *   Provides the "ground truth" for decisions based on the formal rules.
    *   Guarantees correctness and auditability.
    *   Can provide detailed execution traces (which rules fired, what data was used).
    *   Answers foundational questions about a specific decision ("Wat?", "Waarom?", "Wat als?", "Waarom niet?", "Hoe te?") by executing rules, tracing execution, or running hypothetical scenarios based on interpreter capabilities.
    *   Answers questions about the service itself ("Invoer?", "Uitvoer?", "Hoe?", "Visualisatie?") by exposing the parsed model.

*   **The LLM's Role (Comprehensibility & Interaction):**
    *   Acts as a natural language interface to the RegelSpraak engine.
    *   **Translates User Questions:** Converts user queries in everyday language ("Why do I have to pay this much TOKA tax?") into specific queries the engine can answer (e.g., retrieve rule trace for `te betalen belasting`, fetch relevant attribute values).
    *   **Simplifies Technical Output:** Rewrites RegelSpraak rules or engine traces into clear, understandable explanations tailored to the user's level of expertise (e.g., explaining `verminderd met` simply as 'minus').
    *   **Enables Interactive Exploration:** Allows users to ask follow-up questions, drill down into specific rule steps, or explore "what-if" scenarios conversationally.
    *   **Provides Context:** Can enrich explanations with links to relevant external documents (like the actual (fictive) TOKA law text) if provided.

**Synergy:** The RegelSpraak engine ensures the explanation is *correct* and *grounded* in the defined logic, while the LLM makes the explanation *accessible* and *user-friendly*. This addresses the core need for trustworthy *and* understandable automated decision-making.
