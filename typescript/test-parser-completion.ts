import { AntlrParser } from './src/parsers/antlr-parser';

const parser = new AntlrParser();
const text = 'Parameter loon: ';

const suggestions = parser.getExpectedTokensAt(text, text.length);
console.log('Suggestions:', suggestions);