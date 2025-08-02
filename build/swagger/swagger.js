"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = setupSwagger;
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const yamljs_1 = __importDefault(require("yamljs"));
const path_1 = __importDefault(require("path"));
function setupSwagger(app) {
    // Memuat file YAML dari direktori docs
    const swaggerDocument = yamljs_1.default.load(path_1.default.join(__dirname, "../../src/docs/swagger.yaml"));
    // Menyajikan Swagger UI di /docs
    app.use("/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
}
