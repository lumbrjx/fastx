import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { MenuSchema, MenuSchemaData } from "./model.def";
import { Result, parseToResult } from "src/result.model";

import { ZodTypeProvider } from "fastify-type-provider-zod";
import { RouteResponse } from "src/shared/models";

export default async function (app: FastifyInstance) {
  const server = app.withTypeProvider<ZodTypeProvider>();
  server.get(
    "/product",
    {
      schema: {
        body: MenuSchema,
        description: "",
        summary: "",
        tags: [""],

        response: {
          200: RouteResponse,
          400: RouteResponse,
          401: RouteResponse,
          500: RouteResponse,
        },
      },
    },
    async function CreateDataController(
      req: FastifyRequest<{ Body: MenuSchema }>,
      reply: FastifyReply,
    ) {
      try {
        const cx = await CreateDataService(req.body);
        if (!cx.success) {
          return reply.status(500).send({ ok: false, message: cx.error });
        }

        return reply.status(200).send({ ok: true, message: cx.data });
      } catch (error: any) {
        return reply
          .status(500)
          .send({ ok: false, message: "Internal Server Error" });
      }
    },
  );
}
export async function CreateDataService(
  x: MenuSchemaData,
): Promise<Result<string | boolean | undefined, Error | string | undefined>> {
  try {
  } catch (error: any) {
    return parseToResult(undefined, "ROLLBACK");
  }
}

export const autoPrefix = "/products";
