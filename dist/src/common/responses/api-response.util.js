"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.successResponse = successResponse;
exports.errorResponse = errorResponse;
exports.responseData = responseData;
function successResponse(title, message, data) {
    return { title, message, data };
}
function errorResponse(title, message) {
    return { title, message };
}
function responseData(response) {
    if (response && typeof response === 'object' && 'data' in response) {
        return response.data;
    }
    return response;
}
//# sourceMappingURL=api-response.util.js.map