import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

// Swagger definition
const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Real Estate API",
    version: "1.0.0",
    description: "API documentation for the Real Estate App",
  },
  servers: [
    {
      url: "http://localhost:4000",
    },
  ],
};

// Options for swagger-jsdoc
const options = {
  swaggerDefinition,
  apis: ["./index.ts"], // path to files with annotations
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

export { swaggerUi, swaggerSpec };
