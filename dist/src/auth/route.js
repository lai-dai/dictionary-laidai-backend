"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const controller = __importStar(require("./controller"));
const validator_1 = require("../_middlewares/validator");
const schema_1 = require("./schema");
exports.router = express_1.default.Router();
exports.router.post('/register', (0, validator_1.validatorBody)(schema_1.registerSchema), controller.register);
exports.router.post('/login', (0, validator_1.validatorBody)(schema_1.loginSchema), controller.login);
exports.router.post('/verifyGoogleAccount', (0, validator_1.validatorBody)(schema_1.verifyGoogleAccSchema), controller.verifyGoogleAccount);
exports.router.get('/logout', controller.logout);
exports.router.post('/forgotPassword', controller.forgotPassword);
exports.router.patch('/resetPassword/:token', controller.resetPassword);
