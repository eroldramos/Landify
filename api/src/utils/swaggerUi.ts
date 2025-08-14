import type { Express } from "express";
import path from "path";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swaggerDefinition = {
  security: [{ bearerAuth: [] }],
  openapi: "3.0.0",
  info: {
    title: "Landify API",
    version: "1.0.0",
    description: "API documentation with Swagger and TypeScript",
  },
  servers: [
    {
      url: process.env.SWAGGER_API_URL || "http://localhost:3000", // fallback for local
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
};

export function setupSwagger(app: Express, ROOT_FOLDER: string): void {
  console.log(ROOT_FOLDER, "=====================================");

  const options: swaggerJSDoc.Options = {
    swaggerDefinition,
    // ✅ Match both .ts (dev) and .js (prod) files with absolute path
    apis: [path.join(ROOT_FOLDER, "src", "routes", "*.{ts,js}")],
  };

  const swaggerSpec = swaggerJSDoc(options);

  const options2 = {
    customCssUrl: "/public/swagger-ui.css",
    customSiteTitle: "Landify Official Swagger UI",
  };

  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, options2));
}
