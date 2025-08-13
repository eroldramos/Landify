import type { Express } from "express";
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
      url: process.env.SWAGGER_API_URL, // Change to your API URL
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        // 👈 name can be anything
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT", // optional, can be "JWT"
      },
    },
  },
};

export function setupSwagger(app: Express, ROOT_FOLDER: string): void {
  console.log(ROOT_FOLDER, "=====================================");
  const options: swaggerJSDoc.Options = {
    swaggerDefinition,
    apis: ["./src/routes/*", "./src/routes/.js"], // Files containing annotations
  };

  const swaggerSpec = swaggerJSDoc(options);
  const options2 = {
    customCssUrl: "/public/swagger-ui.css",
    customSiteTitle: "Landify Official Swagger UI",
  };
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, options2));
}
