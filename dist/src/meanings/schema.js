"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDataSchema = exports.getAllPartOfSpeechSchema = void 0;
const zod_1 = require("zod");
const common_1 = require("../_lib/schemas/common");
exports.getAllPartOfSpeechSchema = common_1.getAllCommonDataSchema;
exports.createDataSchema = zod_1.z.object({
    wordId: zod_1.z.number().optional(),
    partOfSpeechId: zod_1.z.number().optional(),
});
