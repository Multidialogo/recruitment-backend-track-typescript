import express from "express";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import path from "path";
import YAML from "yaml";
import OpenApiValidator from "express-openapi-validator";

const app = express();
const port = process.env.PORT || 3000;

// Middleware base
app.use(express.json());


const SPEC_PATH = path.join(process.cwd(), "openapi", "invoice-management-v1.yaml");
const specText = fs.readFileSync(SPEC_PATH, "utf8");
const openapiDoc = YAML.parse(specText);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapiDoc, { explorer: true }));
app.get("/docs.json", (_req, res) => res.json(openapiDoc));

app.use(
  OpenApiValidator.middleware({
    apiSpec: SPEC_PATH,
    validateRequests: true,
    validateResponses: true,
  })
);

app.get("/", (_req, res) => {
  res.send("Hello World!");
});

// Error handler (dopo tutte le route e il validator)
app.use((err: any, _req: any, res: any, _next: any) => {
  const status = err.status || 500;
  res.status(status).json({ message: err.message, errors: err.errors });
});

app.listen(port, () => {
  console.log(`API ready:    http://localhost:${port}`);
  console.log(`Swagger UI:   http://localhost:${port}/docs`);
  console.log(`OpenAPI JSON: http://localhost:${port}/docs.json`);
});
