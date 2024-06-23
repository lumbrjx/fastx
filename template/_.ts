import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { _SCHEMA, _DATA } from "./def.model";
import { Result, parseToResult } from "src/result.model";

import { ZodTypeProvider } from "fastify-type-provider-zod";
import { RouteResponse } from "src/shared/models";

export default async function (app: FastifyInstance) {
  const server = app.withTypeProvider<ZodTypeProvider>();
  server.delete(
    "_ROUTE",
    {
      schema: {
        _REST_SCHEMA_TYPE: _SCHEMA,
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
    async function _CONTROLLER(
      req: FastifyRequest<{ _REST_SCHEMA_TYPE_MAJ: _SCHEMA }>,
      reply: FastifyReply,
    ) {
      try {
        const cx = await _SERVICE(req._REST_SCHEMA_TYPE);
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
export async function _SERVICE(
  x: _DATA,
): Promise<Result<string | boolean | undefined, Error | string | undefined>> {
  try {
  } catch (error: any) {
    return parseToResult(undefined, "ROLLBACK");
  }
}

export const autoPrefix = _PREFIX;
