"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.XssMiddleware = void 0;
const common_1 = require("@nestjs/common");
const xss_1 = __importDefault(require("xss"));
let XssMiddleware = class XssMiddleware {
    clean(value) {
        if (typeof value === 'string') {
            return (0, xss_1.default)(value);
        }
        if (Array.isArray(value)) {
            return value.map((v) => this.clean(v));
        }
        if (typeof value === 'object' && value !== null) {
            Object.keys(value).forEach((key) => {
                value[key] = this.clean(value[key]);
            });
        }
        return value;
    }
    use(req, res, next) {
        if (req.body)
            this.clean(req.body);
        if (req.query)
            this.clean(req.query);
        if (req.params)
            this.clean(req.params);
        next();
    }
};
exports.XssMiddleware = XssMiddleware;
exports.XssMiddleware = XssMiddleware = __decorate([
    (0, common_1.Injectable)()
], XssMiddleware);
//# sourceMappingURL=Middleware.js.map