"use strict";
/**
 * Google Generative AI embeddings utility.
 * Uses text-embedding-004 (768-dimensional, free tier).
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
exports.generateEmbedding = generateEmbedding;
exports.generateEmbeddings = generateEmbeddings;
var EMBEDDING_MODEL = "gemini-embedding-2";
var GOOGLE_AI_API_KEY = process.env.GOOGLE_AI_API_KEY;
/**
 * Generate a single embedding vector for a given text string.
 */
function generateEmbedding(text) {
    return __awaiter(this, void 0, void 0, function () {
        var cleanText, response, err, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cleanText = text.replace(/\s+/g, " ").trim().slice(0, 8192);
                    return [4 /*yield*/, fetch("https://generativelanguage.googleapis.com/v1beta/models/".concat(EMBEDDING_MODEL, ":embedContent"), {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "x-goog-api-key": GOOGLE_AI_API_KEY,
                            },
                            body: JSON.stringify({
                                model: "models/".concat(EMBEDDING_MODEL),
                                outputDimensionality: 768,
                                content: { parts: [{ text: cleanText }] },
                                taskType: "RETRIEVAL_DOCUMENT",
                            }),
                        })];
                case 1:
                    response = _a.sent();
                    if (!!response.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.text()];
                case 2:
                    err = _a.sent();
                    throw new Error("Embedding API error: ".concat(response.status, " \u2014 ").concat(err));
                case 3: return [4 /*yield*/, response.json()];
                case 4:
                    data = _a.sent();
                    return [2 /*return*/, data.embedding.values];
            }
        });
    });
}
/**
 * Generate embeddings for multiple texts in sequence.
 * Rate-limited to avoid hitting API limits.
 */
function generateEmbeddings(texts) {
    return __awaiter(this, void 0, void 0, function () {
        var results, _i, texts_1, text, embedding;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    results = [];
                    _i = 0, texts_1 = texts;
                    _a.label = 1;
                case 1:
                    if (!(_i < texts_1.length)) return [3 /*break*/, 5];
                    text = texts_1[_i];
                    return [4 /*yield*/, generateEmbedding(text)];
                case 2:
                    embedding = _a.sent();
                    results.push(embedding);
                    // Small delay to be gentle on the free tier
                    return [4 /*yield*/, new Promise(function (r) { return setTimeout(r, 100); })];
                case 3:
                    // Small delay to be gentle on the free tier
                    _a.sent();
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 1];
                case 5: return [2 /*return*/, results];
            }
        });
    });
}
