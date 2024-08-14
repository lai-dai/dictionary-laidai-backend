"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDataSchema = exports.createDataSchema = exports.dataSchema = exports.getAllDataSchema = void 0;
const zod_1 = require("zod");
const common_1 = require("../_lib/schemas/common");
exports.getAllDataSchema = common_1.getAllCommonDataSchema;
exports.dataSchema = zod_1.z.object({
    id: zod_1.z.number(),
    description: zod_1.z.string().optional(),
});
exports.createDataSchema = exports.dataSchema
    .pick({
    description: true,
})
    .merge(zod_1.z.object({
    wordId: zod_1.z.number(),
    partOfSpeechId: zod_1.z.number(),
}));
exports.updateDataSchema = exports.createDataSchema.partial();
