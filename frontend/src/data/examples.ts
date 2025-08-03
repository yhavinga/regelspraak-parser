// RegelSpraak code examples
export const codeExamples = {
  btw: {
    name: 'BTW Calculation',
    code: `Parameter het btw percentage : Numeriek (getal);
Parameter het bruto bedrag : Numeriek met eenheid EUR;

Regel BTW berekening
geldig altijd
    Het btw bedrag moet berekend worden als het bruto bedrag maal het btw percentage gedeeld door 100.`
  },
  
  age: {
    name: 'Age Verification',
    code: `Parameter de minimum leeftijd : Numeriek (geheel getal) met eenheid jr;
Parameter de huidige leeftijd : Numeriek (geheel getal) met eenheid jr;

Regel Leeftijdscontrole
geldig altijd
    Het toegestaan is waar
    indien de huidige leeftijd groter of gelijk aan de minimum leeftijd is.`
  },
  
  speed: {
    name: 'Speed Limit Check',
    code: `Parameter de maximum snelheid : Numeriek (geheel getal) met eenheid kmpu;
Parameter de gemeten snelheid : Numeriek (geheel getal) met eenheid kmpu;

Regel Snelheidscontrole
geldig altijd
    Het te snel is waar
    indien de gemeten snelheid groter dan de maximum snelheid is.`
  },
  
  person: {
    name: 'Person Age Rules',
    code: `Objecttype de Persoon
    de naam Tekst;
    de leeftijd Numeriek (geheel getal) met eenheid jr;
    is volwassen kenmerk;
    is minderjarig kenmerk;

Parameter de volwassenleeftijd : Numeriek (geheel getal) met eenheid jr;

Regel Volwassenheid
geldig altijd
    Een Persoon is volwassen
    indien zijn leeftijd groter of gelijk aan de volwassenleeftijd is.

Regel Minderjarigheid  
geldig altijd
    Een Persoon is minderjarig
    indien zijn leeftijd kleiner dan de volwassenleeftijd is.`
  }
};

// Test data examples linked to code examples by ID
export const testDataExamples = {
  btw: [
    {
      name: 'Standard VAT (21%)',
      data: {
        "btw percentage": 21,
        "bruto bedrag": 100
      }
    },
    {
      name: 'Reduced VAT (6%)',
      data: {
        "btw percentage": 6,
        "bruto bedrag": 250
      }
    }
  ],
  
  age: [
    {
      name: 'Adult (21 years)',
      data: {
        "minimum leeftijd": 18,
        "huidige leeftijd": 21
      }
    },
    {
      name: 'Minor (16 years)',
      data: {
        "minimum leeftijd": 18,
        "huidige leeftijd": 16
      }
    }
  ],
  
  speed: [
    {
      name: 'Speeding (65 in 50 zone)',
      data: {
        "maximum snelheid": 50,
        "gemeten snelheid": 65
      }
    },
    {
      name: 'Within limit (45 in 50 zone)',
      data: {
        "maximum snelheid": 50,
        "gemeten snelheid": 45
      }
    }
  ],
  
  person: [
    {
      name: 'Adult Person',
      data: {
        persoon: {
          naam: "Jan Jansen",
          leeftijd: 25
        },
        volwassenleeftijd: 18
      }
    },
    {
      name: 'Child Person',
      data: {
        persoon: {
          naam: "Emma de Jong",
          leeftijd: 12
        },
        volwassenleeftijd: 18
      }
    }
  ]
};