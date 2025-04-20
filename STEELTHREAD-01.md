Recommended “steel‑thread, then spiral outward” plan

0. Guiding idea  
   Build a **vertical slice** that already runs from text → parse tree → IR → interpreter → observable result.  
   Once that slice is solid, widen the grammar + IR + interpreter a bit, rerun all tests, repeat.

────────────────────────
STEP 1: Pick an ultra‑small, concrete scenario
────────────────────────
Example (fits on 6 lines of RegelSpraak):

    Parameter de volwassenleeftijd : Numeriek (geheel getal) met eenheid jr;

    Objecttype de Natuurlijk persoon
        is minderjarig kenmerk (bijvoeglijk);
        de leeftijd Numeriek (geheel getal) met eenheid jr;

    Regel Kenmerktoekenning persoon minderjarig
        Een Natuurlijk persoon is minderjarig
        indien zijn leeftijd kleiner is dan de volwassenleeftijd.

Why this snippet?  
• Uses one of every top‑level construct you eventually need (Parameter, Objecttype, Rule).  
• Requires only simple comparison semantics.  
• The “minderjarig” rule is easy to unit‑test.

────────────────────────
STEP 2: Carve out a “Core” grammar that can parse only that snippet
────────────────────────
Option A – temporary mini‑grammar  
Make a file `RegelSpraakCore.g4` that contains **just** the lexer rules + 10‑15 parser rules needed for the snippet.  
Generation: `antlr4 -visitor -Dlanguage=Python3 RegelSpraakCore.g4`

Option B – comment‑gate the big grammar  
Keep the full grammar but enclose still‑unsupported branches in
    // >>> not yet
    /*  ~~~~~~~~~~~~~~~  */
so they do not build references you would have to visit yet.

Either way the parser must succeed on the six‑line example and reject anything else.

────────────────────────
STEP 3: Visitor → minimal IR
────────────────────────
Dataclasses you need today:

    @dataclass
    class Parameter: name: str; unit: str; span: SourceSpan
    @dataclass
    class Attribute: name: str; unit: str
    @dataclass
    class ObjectType: name: str; attributes: list[Attribute]; kenmerken: list[str]
    @dataclass
    class RuleKenmerk:
        object_type: str; kenmerk: str; left_attr: str
        op: Literal["<",">","≤","≥"]
        right_param: str
        span: SourceSpan
    @dataclass
    class Module: parameters: list[Parameter]; object_types: list[ObjectType]; rules: list[RuleKenmerk]

Write one Visitor that returns a `Module`.  
Test cases: “golden” JSON for the six‑line snippet plus a couple of syntax errors that must raise.

────────────────────────
STEP 4: Tiny interpreter for that IR
────────────────────────
• Hard‑code an in‑memory “world”:

      class World:
          parameters: dict[str, int]
          objects: list[NatuurlijkPersoon]

• Function `evaluate_kenmerk(person, kenmerk_name)`:
      if kenmerk_name=="minderjarig":
          return person.leeftijd < world.parameters["volwassenleeftijd"]

• Produce a trace object and print “waar/onwaar”.

Again unit‑test: p1 (15 jr) = waar, p2 (25 jr) = onwaar.

────────────────────────
STEP 5: CLI wrapper
────────────────────────
`python -m regelspraak file.rs --eval "p1 is minderjarig"`

Now you have a full **end‑to‑end** path that you can demo.

────────────────────────
STEP 6: Spiral outward in small, safe increments
────────────────────────
Iteration checklist:

1. Choose next feature (e.g. arithmetic expression in the right‑hand side).  
2. Extend grammar to recognise it; update Visitor + new IR node.  
3. Add interpreter logic + unit tests.  
4. Pass full test suite (old steel thread can never regress).  
5. Commit, tag, repeat.

Concrete expansion order that usually gives fewest cross‑dependencies:

1. Attribute assignment rule (“Berekening” with simple `x = y + z`).  
2. Boolean connectives (and/or/not) inside conditions.  
3. “geldig …” time clauses (but store, do not evaluate yet).  
4. Beslistabel header → treat each row as a generated RuleKenmerk.  
5. Collection navigation / role names.  
6. Units & dimensional analysis.

────────────────────────
Tooling to keep you safe

• `pytest -q` with three levels of fixtures  
  – snippet → parse succeeds/fails as expected  
  – parse → IR JSON equality  
  – IR + little world → expected trace

• CI gate: “all tests green, 95 % coverage, mypy passes”.

• Each interpreter addition guarded behind `match node:`; unknown node raises `NotImplementedFeature` so you never silently ignore new syntax.

────────────────────────
Why this works

• You always have a runnable product (demo value).  
• Grammar, Visitor, IR and interpreter grow together, so drift is impossible.  
• Fail‑fast on unsupported constructs instead of accepting garbage.  
• Tests accrue linearly; refactors stay cheap.

Follow this rhythm and the grand roadmap you drafted simply becomes “add one more loop of the spiral” until the whole language is covered.