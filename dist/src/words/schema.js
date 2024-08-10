"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDataSchema = exports.getAllPartOfSpeechSchema = void 0;
const zod_1 = require("zod");
const common_1 = require("../_lib/schemas/common");
exports.getAllPartOfSpeechSchema = common_1.getAllCommonDataSchema.merge(zod_1.z.object({
    word: zod_1.z.string().optional(),
}));
exports.createDataSchema = zod_1.z.object({
    word: zod_1.z.string().transform((e) => e === null || e === void 0 ? void 0 : e.toLowerCase()),
    phonetic: zod_1.z.string().optional(),
    description: zod_1.z.number().optional(),
});
