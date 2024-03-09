import { FastifyInstance } from "fastify";
import { Controller } from "./_.controller";
import { FooSchema, RouteResponse } from "./_.model";
import { ZodTypeProvider } from "fastify-type-provider-zod";

export default async function (app: FastifyInstance) {
  const server = app.withTypeProvider<ZodTypeProvider>();
  server.post(
    "endpoint",

    {
      schema: {
        body: FooSchema,
        response: {
          200: RouteResponse,
          400: RouteResponse,
          401: RouteResponse,
          500: RouteResponse,
        },
      },
    },
    Controller,
  );

  // app.post(endpoints.tfaLoginDyn, tfagenController);
}
