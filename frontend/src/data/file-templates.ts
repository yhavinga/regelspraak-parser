import { FileTemplate } from '../services/file-service';

export const fileTemplates: FileTemplate[] = [
  {
    id: 'basic-age',
    name: 'Leeftijdscontrole',
    description: 'Basis regel voor leeftijdscontrole',
    category: 'Basis',
    content: `Objecttype de Persoon
    de naam Tekst;
    de leeftijd Numeriek (geheel getal) met eenheid jr;
    is volwassen kenmerk;

Parameter de minimumleeftijd : Numeriek (geheel getal) met eenheid jr;

Regel Volwassenheid
geldig voor alle Persoon
    Een Persoon is volwassen
    indien zijn leeftijd groter of gelijk is aan de minimumleeftijd.`,
    testData: JSON.stringify({
      persoon: {
        naam: "Jan Jansen",
        leeftijd: { value: 25, unit: "jr" }
      },
      minimumleeftijd: { value: 18, unit: "jr" }
    }, null, 2)
  },
  
  {
    id: 'discount',
    name: 'Kortingsregels',
    description: 'Voorbeeld van kortingsberekening',
    category: 'Financieel',
    content: `Objecttype de Bestelling
    het totaalbedrag Bedrag;
    de korting Percentage;
    het eindbedrag Bedrag;

Parameter de minimumbedrag : Bedrag;
Parameter de kortingspercentage : Percentage;

Regel Kortingsregel
geldig voor alle Bestelling
    De korting van een Bestelling is het kortingspercentage
    indien haar totaalbedrag groter is dan het minimumbedrag.

Regel Eindberekening
geldig voor alle Bestelling
    Het eindbedrag van een Bestelling moet gesteld worden op
    haar totaalbedrag verminderd met (haar totaalbedrag * haar korting / 100%).`,
    testData: JSON.stringify({
      bestelling: {
        totaalbedrag: { value: 150, unit: "euro" }
      },
      minimumbedrag: { value: 100, unit: "euro" },
      kortingspercentage: { value: 10, unit: "%" }
    }, null, 2)
  },
  
  {
    id: 'date-calc',
    name: 'Datum berekeningen',
    description: 'Werken met datums en termijnen',
    category: 'Datum/Tijd',
    content: `Objecttype de Aanvraag
    de aanvraagdatum Datum;
    de vervaldatum Datum;
    is verlopen kenmerk;

Parameter de geldigheidstermijn : Tijdsduur;

Regel Vervaldatum
geldig voor alle Aanvraag
    De vervaldatum van een Aanvraag moet gesteld worden op
    haar aanvraagdatum vermeerderd met de geldigheidstermijn.

Regel Verlopen
geldig voor alle Aanvraag
    Een Aanvraag is verlopen
    indien de huidige datum later is dan haar vervaldatum.`,
    testData: JSON.stringify({
      aanvraag: {
        aanvraagdatum: { value: "2024-01-01", type: "date" }
      },
      geldigheidstermijn: { value: 30, unit: "dagen" }
    }, null, 2)
  },
  
  {
    id: 'decision-table',
    name: 'Beslistabel',
    description: 'Voorbeeld met een beslistabel',
    category: 'Geavanceerd',
    content: `Objecttype de Klant
    de leeftijd Numeriek (geheel getal) met eenheid jr;
    de inkomen Bedrag;
    de risicoprofiel Tekst;

Beslistabel Risicobepaling
geldig voor alle Klant

| leeftijd    | inkomen         | risicoprofiel |
|-------------|-----------------|---------------|
| < 25 jr     | < 2000 euro     | "hoog"        |
| < 25 jr     | >= 2000 euro    | "midden"      |
| 25-65 jr    | < 3000 euro     | "midden"      |
| 25-65 jr    | >= 3000 euro    | "laag"        |
| > 65 jr     | *               | "hoog"        |`,
    testData: JSON.stringify({
      klant: {
        leeftijd: { value: 30, unit: "jr" },
        inkomen: { value: 3500, unit: "euro" }
      }
    }, null, 2)
  }
];

export function getTemplatesByCategory(): Record<string, FileTemplate[]> {
  const grouped: Record<string, FileTemplate[]> = {};
  
  fileTemplates.forEach(template => {
    if (!grouped[template.category]) {
      grouped[template.category] = [];
    }
    grouped[template.category].push(template);
  });
  
  return grouped;
}