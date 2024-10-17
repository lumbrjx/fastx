#include <string.h>
#include "code.h"

void capitalizeFirstLetter(char *str) {
    if (str == NULL || strlen(str) == 0) {
        return; 
    }
    
    if (str[0] >= 'a' && str[0] <= 'z') {
        str[0] = str[0] - ('a' - 'A'); 
    }
}

void replaceSubstring(char *source, const char *target, const char *replacement) {
    char buffer[8192];
    char *insert_point = &buffer[0];
    const char *tmp = source;
    size_t target_len = strlen(target);
    size_t replacement_len = strlen(replacement);

    while (1) {
        const char *p = strstr(tmp, target);

        if (p == NULL) {
            strcpy(insert_point, tmp);
            break;
        }

        memcpy(insert_point, tmp, p - tmp);
        insert_point += p - tmp;
        memcpy(insert_point, replacement, replacement_len);
        insert_point += replacement_len;
        tmp = p + target_len;
    }

    strcpy(source, buffer);
}

const char *code =
    "import { FastifyInstance, FastifyReply, FastifyRequest } from \"fastify\";\n"
    "import { _SCHEMA, _DATA } from \"./model.def\";\n"
    "import { Result, parseToResult } from \"src/shared/result\";\n"
    "\n"
    "import { ZodTypeProvider } from \"fastify-type-provider-zod\";\n"
    "import { RouteResponse } from \"src/shared/models\";\n"
    "\n"
    "export default async function (app: FastifyInstance) {\n"
    "  const server = app.withTypeProvider<ZodTypeProvider>();\n"
    "  server._OPS(\n"
    "    \"_ROUTE\",\n"
    "    {\n"
    "      schema: {\n"
    "        _REST_SCMA_TYPE: _SCHEMA,\n"
    "        description: \"\",\n"
    "        summary: \"\",\n"
    "        tags: [\"\"],\n"
    "\n"
    "        response: {\n"
    "          200: RouteResponse,\n"
    "          400: RouteResponse,\n"
    "          401: RouteResponse,\n"
    "          500: RouteResponse,\n"
    "        },\n"
    "      },\n"
    "    },\n"
    "    async function _CONTROLLER(\n"
    "      req: FastifyRequest<{ _REST_SCEA_TYPE_MAJ: _DATA }>,\n"
    "      reply: FastifyReply,\n"
    "    ) {\n"
    "      try {\n"
    "        const cx = await _SERVICE(req._REST_SCMA_TYPE);\n"
    "        if (!cx.success) {\n"
    "          return reply.status(500).send({ ok: false, message: cx.error });\n"
    "        }\n"
    "\n"
    "        return reply.status(200).send({ ok: true, message: cx.data });\n"
    "      } catch (error: any) {\n"
    "        return reply\n"
    "          .status(500)\n"
    "          .send({ ok: false, message: \"Internal Server Error\" });\n"
    "      }\n"
    "    },\n"
    "  );\n"
    "}\n"
    "export async function _SERVICE(\n"
    "  x: _DATA,\n"
    "): Promise<Result<string | boolean | undefined, Error | string | undefined>> {\n"
    "  try {\n"
    "  } catch (error: any) {\n"
    "    return parseToResult(undefined, \"ROLLBACK\");\n"
    "  }\n"
    "}\n"
    "\n"
    "export const autoPrefix = \"/_PREFIX\";\n";

