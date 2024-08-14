"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
// get post routes
exports.app.get('/post', (req, res) => {
    res.status(200).json({ message: 'post routes' });
});
// root routes
exports.app.get('/', (req, res) => {
    res.status(200).json({ message: 'Hello World' });
});
exports.app.post('/', (req, res) => {
    req.body;
    res.status(200).json({ message: 'Hello World', data: req.body });
});
exports.app.listen(5000, () => console.log('Server ready on port 5000.'));
