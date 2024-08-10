"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMyPasswordSchema = void 0;
const zod_1 = require("zod");
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
