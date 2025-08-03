export const exampleTemplates = {
  basic: {
    name: 'Basic Age Rule',
    code: `Objecttype de Persoon
    de naam Tekst;
    de leeftijd Numeriek (geheel getal) met eenheid jr;
    is volwassen kenmerk;

Parameter de volwassenleeftijd : Numeriek (geheel getal) met eenheid jr;

Regel Volwassenheid
geldig altijd
    Een Persoon is volwassen
    indien zijn leeftijd groter of gelijk aan de volwassenleeftijd is.`,
    
    testData: {
      persoon: {
        naam: "Jan Jansen",
        leeftijd: 25
      },
      volwassenleeftijd: 18
    }
  },
  
  pensioen: {
    name: 'Pension Check',
    code: `Objecttype de Persoon
    de naam Tekst;
    de leeftijd Numeriek (geheel getal) met eenheid jr;
    is met pensioen kenmerk;

Parameter de pensioenleeftijd : Numeriek (geheel getal) met eenheid jr;

Regel Pensioencheck
geldig altijd
    Een Persoon is met pensioen
    indien zijn leeftijd groter of gelijk aan de pensioenleeftijd is.`,
    
    testData: {
      persoon: {
        naam: "Marie de Vries",
        leeftijd: 67
      },
      pensioenleeftijd: 65
    }
  },
  
  discount: {
    name: 'Discount Rule',
    code: `Objecttype de Bestelling
    het totaalbedrag Bedrag;
    de korting Percentage;

Regel Kortingsregel
geldig altijd
    De korting van een Bestelling is 10%
    indien haar totaalbedrag groter dan 100 euro is.`,
    
    testData: {
      bestelling: {
        totaalbedrag: 150
      }
    }
  }
};