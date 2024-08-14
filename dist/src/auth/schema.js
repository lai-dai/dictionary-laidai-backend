"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyGoogleAccSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z
    .object({
    name: zod_1.z
        .string()
        .min(1, 'at least 1 character')
        .max(50, 'no more than 50 characters')
        .trim(),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6, 'must be at least 6 characters long'),
    passwordConfirm: zod_1.z.string(),
})
    .refine((data) => data.password === data.passwordConfirm, {
    message: 'not match password',
    path: ['passwordConfirm'],
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email().trim(),
    password: zod_1.z.string().min(6, 'must be at least 6 characters long'),
});
exports.verifyGoogleAccSchema = zod_1.z.object({
    idToken: zod_1.z.string(),
});
