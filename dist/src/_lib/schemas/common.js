"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleSchema = exports.orderSchema = exports.getAllCommonDataSchema = void 0;
const zod_1 = require("zod");
const common_1 = require("../constants/common");
exports.getAllCommonDataSchema = zod_1.z.object({
    page: zod_1.z
        .number()
        .or(zod_1.z.string().regex(/^\d+$/, 'number').transform(Number))
        .default(common_1.DEFAULT_PAGE)
        .refine((n) => n > 0, 'greater than 0'),
    pageSize: zod_1.z
        .number()
        .or(zod_1.z.string().regex(/^\d+$/, 'number').transform(Number))
        .default(common_1.DEFAULT_PAGE_SIZE)
        .refine((n) => n > 0, 'greater than 0'),
    key: zod_1.z.string().optional(),
});
exports.orderSchema = zod_1.z.enum(['DESC', 'ASC', '']);
exports.roleSchema = zod_1.z.enum(['user', 'admin']);
