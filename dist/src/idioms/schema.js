"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDataSchema = exports.createDataSchema = exports.getAllDataSchema = exports.dataSchema = void 0;
const zod_1 = require("zod");
const common_1 = require("../_lib/schemas/common");
exports.dataSchema = zod_1.z.object({
    id: zod_1.z.number(),
    idiom: zod_1.z.string().transform((e) => e === null || e === void 0 ? void 0 : e.toLowerCase()),
    definition: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
});
exports.getAllDataSchema = common_1.getAllCommonDataSchema.merge(exports.dataSchema
    .pick({
    idiom: true,
})
    .partial());
exports.createDataSchema = exports.dataSchema.omit({ id: true }).merge(zod_1.z.object({
    wordId: zod_1.z.number(),
}));
exports.updateDataSchema = exports.createDataSchema.partial();
