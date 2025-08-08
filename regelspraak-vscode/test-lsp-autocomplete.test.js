"use strict";
/**
 * Test LSP autocomplete functionality
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
function createMessage(content) {
    var json = JSON.stringify(content);
    var contentLength = Buffer.byteLength(json, 'utf8');
    return "Content-Length: ".concat(contentLength, "\r\n\r\n").concat(json);
}
var LSPClient = /** @class */ (function () {
    function LSPClient() {
        var _this = this;
        this.responseBuffer = '';
        this.expectedLength = 0;
        this.responseHandlers = new Map();
        this.nextId = 1;
        this.server = (0, child_process_1.spawn)('node', ['dist/server.js', '--stdio'], {
            stdio: ['pipe', 'pipe', 'inherit']
        });
        this.server.stdout.on('data', function (data) {
            _this.handleData(data.toString());
        });
    }
    LSPClient.prototype.handleData = function (data) {
        this.responseBuffer += data;
        while (true) {
            if (this.expectedLength === 0) {
                var match = this.responseBuffer.match(/Content-Length: (\d+)\r\n\r\n/);
                if (!match)
                    break;
                this.expectedLength = parseInt(match[1]);
                this.responseBuffer = this.responseBuffer.substring(match.index + match[0].length);
            }
            if (this.responseBuffer.length >= this.expectedLength) {
                var message = this.responseBuffer.substring(0, this.expectedLength);
                this.responseBuffer = this.responseBuffer.substring(this.expectedLength);
                this.expectedLength = 0;
                var response = JSON.parse(message);
                if (response.id && this.responseHandlers.has(response.id)) {
                    this.responseHandlers.get(response.id)(response);
                    this.responseHandlers.delete(response.id);
                }
            }
            else {
                break;
            }
        }
    };
    LSPClient.prototype.request = function (method, params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) {
                        var id = _this.nextId++;
                        _this.responseHandlers.set(id, function (response) {
                            resolve(response.result);
                        });
                        _this.server.stdin.write(createMessage({
                            jsonrpc: '2.0',
                            id: id,
                            method: method,
                            params: params
                        }));
                    })];
            });
        });
    };
    LSPClient.prototype.notify = function (method, params) {
        this.server.stdin.write(createMessage({
            jsonrpc: '2.0',
            method: method,
            params: params
        }));
    };
    LSPClient.prototype.close = function () {
        this.server.kill();
    };
    return LSPClient;
}());
function runTests() {
    return __awaiter(this, void 0, void 0, function () {
        var client, result1, labels1, result2, labels2, docWithDomain, result3, labels3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    client = new LSPClient();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 6, 7]);
                    // Initialize
                    return [4 /*yield*/, client.request('initialize', {
                            rootUri: null,
                            capabilities: {}
                        })];
                case 2:
                    // Initialize
                    _a.sent();
                    // Test 1: Type suggestions after parameter colon
                    client.notify('textDocument/didOpen', {
                        textDocument: {
                            uri: 'file:///test1.regelspraak',
                            languageId: 'regelspraak',
                            version: 1,
                            text: 'Parameter loon: '
                        }
                    });
                    return [4 /*yield*/, client.request('textDocument/completion', {
                            textDocument: { uri: 'file:///test1.regelspraak' },
                            position: { line: 0, character: 16 }
                        })];
                case 3:
                    result1 = _a.sent();
                    labels1 = result1.map(function (item) { return item.label; });
                    console.log('Test 1 - Parameter types received:', labels1);
                    console.log('✅ Test 1 - Parameter types:', labels1.includes('Bedrag') && labels1.includes('Numeriek'));
                    // Test 2: Keywords after "geldig"
                    client.notify('textDocument/didOpen', {
                        textDocument: {
                            uri: 'file:///test2.regelspraak',
                            languageId: 'regelspraak',
                            version: 1,
                            text: 'Regel Test\n  geldig '
                        }
                    });
                    return [4 /*yield*/, client.request('textDocument/completion', {
                            textDocument: { uri: 'file:///test2.regelspraak' },
                            position: { line: 1, character: 9 }
                        })];
                case 4:
                    result2 = _a.sent();
                    labels2 = result2.map(function (item) { return item.label; });
                    console.log('✅ Test 2 - Keywords after geldig:', labels2.includes('altijd') || labels2.includes('indien'));
                    docWithDomain = "Domein Status {\n  'actief',\n  'inactief'\n}\n\nParameter klant_status: Status;\n\nRegel Check\n  geldig indien klant_status is gelijk aan ";
                    client.notify('textDocument/didOpen', {
                        textDocument: {
                            uri: 'file:///test3.regelspraak',
                            languageId: 'regelspraak',
                            version: 1,
                            text: docWithDomain
                        }
                    });
                    return [4 /*yield*/, client.request('textDocument/completion', {
                            textDocument: { uri: 'file:///test3.regelspraak' },
                            position: { line: 8, character: 42 }
                        })];
                case 5:
                    result3 = _a.sent();
                    labels3 = result3.map(function (item) { return item.label; });
                    console.log('✅ Test 3 - Domain values:', labels3.includes("'actief'") || labels3.includes("'inactief'"));
                    console.log('\nAll tests completed!');
                    return [3 /*break*/, 7];
                case 6:
                    client.close();
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    });
}
runTests().catch(console.error);
