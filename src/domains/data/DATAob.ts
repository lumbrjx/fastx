import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { ProductSchema, ProductSchemaData } from "./model.def";
import { Result, parseToResult } from "src/result.model";

import { ZodTypeProvider } from "fastify-type-provider-zod";
import { RouteResponse } from "src/shared/models";

export default async function (app: FastifyInstance) {
  const server = app.withTypeProvider<ZodTypeProvider>();
  server.get(
    "product",
    {
      schema: {
        body: ProductSchema,
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
    async function DATAobController(
      req: FastifyRequest<{ Body: ProductSchema }>,
      reply: FastifyReply,
    ) {
      try {
        const cx = await DATAobService(req.body);
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
export async function DATAobService(
  x: ProductSchemaData,
): Promise<Result<string | boolean | undefined, Error | string | undefined>> {
  try {
  } catch (error: any) {
    return parseToResult(undefined, "ROLLBACK");
  }
}

export const autoPrefix = "/products";
