import { Express } from "express";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";

export function setupSwagger(app: Express) {
  // Memuat file YAML dari direktori docs
  const swaggerDocument = YAML.load(path.join(__dirname, "../../src/docs/swagger.yaml"));

  // Menyajikan Swagger UI di /docs
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}