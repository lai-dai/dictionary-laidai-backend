"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMyPasswordSchema = exports.updateDataSchema = exports.createDataSchema = exports.getAllDataSchema = exports.dataSchema = void 0;
const zod_1 = require("zod");
const common_1 = require("../_lib/schemas/common");
exports.dataSchema = zod_1.z.object({
    id: zod_1.z.number(),
    name: zod_1.z.string(),
    email: zod_1.z.string(),
    image: zod_1.z.string().optional(),
    role: common_1.roleSchema.default('user').optional(),
    password: zod_1.z.string().optional(),
    passwordChangedAt: zod_1.z.date().or(zod_1.z.number()).optional(),
    passwordResetToken: zod_1.z.string().optional(),
    passwordResetExpires: zod_1.z.date().or(zod_1.z.number()).optional(),
    active: zod_1.z.boolean().default(true).optional(),
    provider: zod_1.z
        .enum(['github', 'google', 'credentials'])
        .default('credentials')
        .optional(),
});
exports.getAllDataSchema = common_1.getAllCommonDataSchema.merge(exports.dataSchema
    .pick({
    name: true,
    email: true,
    role: true,
    active: true,
    provider: true,
})
    .partial());
exports.createDataSchema = exports.dataSchema.omit({ id: true });
exports.updateDataSchema = exports.createDataSchema.partial();
exports.updateMyPasswordSchema = zod_1.z
    .object({
    passwordCurrent: zod_1.z.string(),
    password: zod_1.z.string().min(8, 'must be at least 8 characters long'),
    passwordConfirm: zod_1.z.string(),
})
    .refine((data) => data.password === data.passwordConfirm, {
    message: 'not match password',
    path: ['passwordConfirm'],
});
