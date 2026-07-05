"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_config_1 = __importDefault(require("./typeorm.config"));
const entities_1 = require("./entities");
const admin_seeder_1 = require("./seeders/admin.seeder");
async function bootstrap() {
    await typeorm_config_1.default.initialize();
    try {
        const admin = await (0, admin_seeder_1.seedAdminUser)(typeorm_config_1.default.getRepository(entities_1.UserEntity));
        console.log(`Admin user ready: ${admin.username}`);
    }
    finally {
        await typeorm_config_1.default.destroy();
    }
}
bootstrap().catch((error) => {
    console.error(error);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map