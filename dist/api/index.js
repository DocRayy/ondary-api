"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const bootstrap_1 = require("../src/bootstrap");
let server;
async function handler(req, res) {
    if (!server) {
        const app = await (0, bootstrap_1.createApp)();
        await app.init();
        server = app.getHttpAdapter().getInstance();
    }
    const requestHandler = server;
    return requestHandler(req, res);
}
//# sourceMappingURL=index.js.map