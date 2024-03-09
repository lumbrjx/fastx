import { FooData } from "./_.model";
import { FastifyRequest, FastifyReply } from "fastify";
import { fooService } from "./_.service";
// Login
export async function Controller(
  req: FastifyRequest<{ Body: FooData }>,
  reply: FastifyReply,
) {
  try {
    const { foo, bar } = req.body;
    const fooResult = await fooService({ foo, bar });

    return reply.status(200).send({ ok: true, message: "authenticated" });
  } catch (error: any) {
    return reply
      .status(500)
      .send({ ok: false, message: "Internal Server Error" });
  }
}
