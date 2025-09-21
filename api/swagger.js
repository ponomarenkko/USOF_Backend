import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "USOF API",
      version: "1.0.0",
      description: "API documentation for USOF backend",
    },
    servers: [{ url: "http://localhost:" + (process.env.PORT || 3000) }],
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ["./api/routes/**/*.js", "./api/controllers/**/*.js"],
};

const spec = swaggerJsdoc(options);

export default function setupSwagger(app) {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(spec));
}
