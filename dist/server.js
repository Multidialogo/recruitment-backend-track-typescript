"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const fs_1 = __importDefault(require("fs"));
const yaml_1 = __importDefault(require("yaml"));
const express_openapi_validator_1 = __importDefault(require("express-openapi-validator"));
const app = (0, express_1.default)();
const port = 3000;
// carica lo YAML e trasformalo in oggetto JS
const specText = fs_1.default.readFileSync("src/openapi/invoice-management-v1.yaml", "utf8");
const openapiDoc = yaml_1.default.parse(specText);
// 👉 Swagger UI come **middleware**
app.use("/swagger-ui", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(openapiDoc, { explorer: true }));
// opzionale: endpoint con lo JSON della spec (utile per tool/client)
app.get("/swagger-ui.json", (_req, res) => res.json(openapiDoc));
app.listen(3000, () => console.log("Docs: http://localhost:3000/docs"));
tp: //localhost:3000/docs"));
 app.use(express_openapi_validator_1.default.middleware({
    apiSpec: "src/openapi/invoice-management-v1.yaml",
    validateRequests: true,
    validateResponses: true,
}));
app.use((err, _req, res, _next) => {
    res.status(err.status || 500).json({ message: err.message, errors: err.errors });
});
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
