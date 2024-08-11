"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDataSchema = exports.createDataSchema = exports.dataSchema = exports.getAllDataSchema = void 0;
const zod_1 = require("zod");
const common_1 = require("../_lib/schemas/common");
exports.getAllDataSchema = common_1.getAllCommonDataSchema.merge(zod_1.z.object({
    name: zod_1.z.string().optional(),
    order: common_1.orderSchema.optional(),
}));
exports.dataSchema = zod_1.z.object({
    id: zod_1.z.number(),
    name: zod_1.z.string().transform((e) => e === null || e === void 0 ? void 0 : e.toLowerCase()),
    order: zod_1.z.number(),
    abbreviation: zod_1.z.string().optional(),
    definition: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
});
exports.createDataSchema = exports.dataSchema.omit({ id: true });
exports.updateDataSchema = exports.createDataSchema.partial();
