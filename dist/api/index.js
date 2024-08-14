"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json({ limit: '10kb' }));
exports.app.get('/', (req, res) => res.send('Express on Vercel'));
exports.app.post('/', (req, res) => {
    console.log('🚀 req.body', req.body);
    res.send(req.body ? JSON.stringify(req.body) : 'Not body');
});
exports.app.listen(3000, () => console.log('Server ready on port 3000.'));
