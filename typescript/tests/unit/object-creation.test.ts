import { Engine, Context } from '../../src';

describe('Object Creation', () => {
    let engine: Engine;

    beforeEach(() => {
        engine = new Engine();
    });

    test('should create a simple object without attributes', () => {
        const modelText = `
            Objecttype de Persoon
                de naam Tekst;
                is actief kenmerk;
            
            Regel MaakNieuwePersoon
            geldig altijd
                Er wordt een nieuw Persoon aangemaakt.
        `;
        
        const context = new Context();
        
        // Execute the model
        const result = engine.run(modelText, context);
        
        expect(result.success).toBe(true);
        
        // Check that the rule was executed
        const trace = context.getExecutionTrace();
        expect(trace.length).toBeGreaterThan(0);
        
        // Check that a new Persoon object was created
        const persons = context.getObjectsByType('Persoon');
        expect(persons).toBeDefined();
        expect(persons.length).toBe(1);
        
        const newPerson = persons[0];
        expect(newPerson.type).toBe('object');
        expect(newPerson.objectType).toBe('Persoon');
    });

    test('should create an object with attributes', () => {
        const modelText = `
            Objecttype de Klant
                de naam Tekst;
                de leeftijd Numeriek;
                de email Tekst;
            
            Regel MaakVasteKlant
            geldig altijd
                Er wordt een nieuw Klant aangemaakt 
                met naam "Jan Jansen"
                en leeftijd 35
                en email "jan@example.com".
        `;
        
        const context = new Context();
        
        // Execute the model
        const result = engine.run(modelText, context);
        
        expect(result.success).toBe(true);
        
        // Check that a new Klant object was created with attributes
        const klanten = context.getObjectsByType('Klant');
        expect(klanten.length).toBe(1);
        
        const newKlant = klanten[0];
        expect(newKlant.type).toBe('object');
        expect(newKlant.objectType).toBe('Klant');
        expect(newKlant.value.naam).toEqual({ type: 'string', value: 'Jan Jansen' });
        expect(newKlant.value.leeftijd).toEqual({ type: 'number', value: 35 });
        expect(newKlant.value.email).toEqual({ type: 'string', value: 'jan@example.com' });
    });

    test('should create object with computed attribute values', () => {
        const modelText = `
            Objecttype de Product
                de naam Tekst;
                de prijs Numeriek met eenheid EUR;
                de btw Numeriek met eenheid EUR;
            
            Parameter de btw_percentage : Numeriek
            
            Regel MaakProduct
            geldig altijd
                Er wordt een nieuw Product aangemaakt
                met naam "Laptop"
                en prijs 1000
                en btw (de prijs maal de btw_percentage gedeeld door 100).
        `;
        
        const context = new Context();
        context.setVariable('btw_percentage', { type: 'number', value: 21 });
        
        // Execute the model
        const result = engine.run(modelText, context);
        
        expect(result.success).toBe(true);
        
        // Check the created product
        const products = context.getObjectsByType('Product');
        expect(products.length).toBe(1);
        
        const product = products[0];
        expect(product.value.naam).toEqual({ type: 'string', value: 'Laptop' });
        expect(product.value.prijs).toEqual({ type: 'number', value: 1000 });
        expect(product.value.btw).toEqual({ type: 'number', value: 210 });
    });

    test('should create object with conditional rule', () => {
        const modelText = `
            Objecttype de Werknemer
                de naam Tekst;
                de salaris Numeriek met eenheid EUR;
            
            Parameter de minimum_leeftijd : Numeriek
            
            Regel MaakWerknemer
            geldig altijd
                Er wordt een nieuw Werknemer aangemaakt
                met naam "Peter"
                en salaris 3000
                indien de leeftijd groter is dan de minimum_leeftijd.
        `;
        
        const context = new Context();
        context.setVariable('minimum_leeftijd', { type: 'number', value: 18 });
        
        // Test with age below minimum - should not create
        context.setVariable('leeftijd', { type: 'number', value: 16 });
        let result = engine.run(modelText, context);
        expect(result.success).toBe(true);
        let werknemers = context.getObjectsByType('Werknemer');
        expect(werknemers.length).toBe(0);
        
        // Test with age above minimum - should create
        context.setVariable('leeftijd', { type: 'number', value: 25 });
        result = engine.run(modelText, context);
        expect(result.success).toBe(true);
        werknemers = context.getObjectsByType('Werknemer');
        expect(werknemers.length).toBe(1);
        
        const werknemer = werknemers[0];
        expect(werknemer.value.naam).toEqual({ type: 'string', value: 'Peter' });
        expect(werknemer.value.salaris).toEqual({ type: 'number', value: 3000 });
    });

    test.skip('should handle multiple object creation in one rule - not supported by grammar', () => {
        const modelText = `
            Objecttype de Order
                de ordernummer Numeriek;
                de status Tekst;
            
            Objecttype de Factuur
                de factuurnummer Numeriek;
                de ordernummer Numeriek;
            
            Regel MaakOrderEnFactuur
            geldig altijd
                Er wordt een nieuw Order aangemaakt
                met ordernummer 12345
                en status "nieuw".
                
                Er wordt een nieuw Factuur aangemaakt
                met factuurnummer 67890
                en ordernummer 12345.
        `;
        
        const context = new Context();
        
        // Execute the model
        const result = engine.run(modelText, context);
        
        expect(result.success).toBe(true);
        
        // Check both objects were created
        const orders = context.getObjectsByType('Order');
        expect(orders.length).toBe(1);
        expect(orders[0].value.ordernummer).toEqual({ type: 'number', value: 12345 });
        expect(orders[0].value.status).toEqual({ type: 'string', value: 'nieuw' });
        
        const facturen = context.getObjectsByType('Factuur');
        expect(facturen.length).toBe(1);
        expect(facturen[0].value.factuurnummer).toEqual({ type: 'number', value: 67890 });
        expect(facturen[0].value.ordernummer).toEqual({ type: 'number', value: 12345 });
    });
});