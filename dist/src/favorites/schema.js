"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDataSchema = exports.createDataSchema = exports.getAllDataSchema = exports.dataSchema = void 0;
const zod_1 = require("zod");
const common_1 = require("../_lib/schemas/common");
exports.dataSchema = zod_1.z.object({
    id: zod_1.z.number(),
});
exports.getAllDataSchema = common_1.getAllCommonDataSchema;
exports.createDataSchema = zod_1.z.object({
    userId: zod_1.z.number(),
    wordId: zod_1.z.number(),
});
exports.updateDataSchema = exports.createDataSchema.partial();
