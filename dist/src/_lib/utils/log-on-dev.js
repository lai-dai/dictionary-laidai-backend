"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logOnDev = logOnDev;
function logOnDev(...message) {
    if (process.env.NODE_ENV === 'development') {
        console.log(...message);
    }
}
