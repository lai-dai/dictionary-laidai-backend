"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDataSchema = exports.getAllDataSchema = void 0;
const zod_1 = require("zod");
const common_1 = require("../_lib/schemas/common");
exports.getAllDataSchema = common_1.getAllCommonDataSchema.merge(zod_1.z.object({
    sentence: zod_1.z.string().optional(),
    translate: zod_1.z.string().optional(),
}));
exports.createDataSchema = zod_1.z.object({
    sentence: zod_1.z.string(),
    translate: zod_1.z.string().optional(),
    definitionId: zod_1.z.number().optional(),
});
