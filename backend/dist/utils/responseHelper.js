"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendError = exports.sendSuccess = void 0;
const sendSuccess = (res, message, data = null, statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
    });
};
exports.sendSuccess = sendSuccess;
const sendError = (res, message, statusCode = 400) => {
    return res.status(statusCode).json({
        success: false,
        message,
        data: null,
    });
};
exports.sendError = sendError;
