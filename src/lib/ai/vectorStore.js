"use strict";
/**
 * Vector store utility — wraps Supabase pgvector operations.
 * Uses the service-role client to bypass RLS for server-side operations.
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
exports.upsertChunk = upsertChunk;
exports.deleteChunks = deleteChunks;
exports.searchSimilar = searchSimilar;
var supabase_js_1 = require("@supabase/supabase-js");
var embeddings_1 = require("./embeddings");
var supabase = (0, supabase_js_1.createClient)(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
/**
 * Upsert a knowledge chunk. Generates its embedding and saves to Supabase.
 */
function upsertChunk(chunk) {
    return __awaiter(this, void 0, void 0, function () {
        var embedding, error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, embeddings_1.generateEmbedding)(chunk.content)];
                case 1:
                    embedding = _a.sent();
                    return [4 /*yield*/, supabase.from("knowledge_chunks").upsert({
                            id: chunk.id,
                            content: chunk.content,
                            metadata: chunk.metadata,
                            embedding: embedding,
                            source_type: chunk.source_type,
                            source_id: chunk.source_id,
                            updated_at: new Date().toISOString(),
                        }, { onConflict: "id" })];
                case 2:
                    error = (_a.sent()).error;
                    if (error)
                        throw new Error("upsertChunk error: ".concat(error.message));
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Delete all chunks belonging to a source record (e.g., when a tour is deleted).
 */
function deleteChunks(sourceType, sourceId) {
    return __awaiter(this, void 0, void 0, function () {
        var error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, supabase
                        .from("knowledge_chunks")
                        .delete()
                        .eq("source_type", sourceType)
                        .eq("source_id", sourceId)];
                case 1:
                    error = (_a.sent()).error;
                    if (error)
                        throw new Error("deleteChunks error: ".concat(error.message));
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Search the knowledge base using cosine similarity.
 * Returns top `limit` results above the similarity threshold.
 */
function searchSimilar(query_1) {
    return __awaiter(this, arguments, void 0, function (query, limit) {
        var embedding, _a, data, error;
        var _b;
        if (limit === void 0) { limit = 5; }
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, (0, embeddings_1.generateEmbedding)(query)];
                case 1:
                    embedding = _c.sent();
                    return [4 /*yield*/, supabase.rpc("match_knowledge", {
                            query_embedding: embedding,
                            match_count: limit,
                            min_similarity: 0.25,
                        })];
                case 2:
                    _a = _c.sent(), data = _a.data, error = _a.error;
                    if (error)
                        throw new Error("searchSimilar error: ".concat(error.message));
                    return [2 /*return*/, (_b = data) !== null && _b !== void 0 ? _b : []];
            }
        });
    });
}
