"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDataSchema = exports.createDataSchema = exports.getAllDataSchema = exports.dataSchema = void 0;
const zod_1 = require("zod");
const common_1 = require("../_lib/schemas/common");
exports.dataSchema = zod_1.z.object({
    id: zod_1.z.number(),
    content: zod_1.z.string(),
    totalLike: zod_1.z.number().optional(),
    commentId: zod_1.z.number().nullable().optional(),
});
exports.getAllDataSchema = common_1.getAllCommonDataSchema.merge(exports.dataSchema
    .pick({
    content: true,
})
    .partial());
exports.createDataSchema = exports.dataSchema.omit({ id: true }).merge(zod_1.z.object({
    commentId: zod_1.z.number().optional(),
}));
exports.updateDataSchema = exports.createDataSchema.partial();
