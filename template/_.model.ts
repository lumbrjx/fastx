import { z } from "zod";
export interface FooAndBarType {
  username: string;
  password: string;
}
export const FooSchema = z.object({
  foo: z.string().min(1),
  bar: z.string().min(1),
});
export const RouteResponse = z.object({
  ok: z.boolean(),
  message: z.string().min(1),
});
export interface RouteResponseData extends z.infer<typeof RouteResponse> {}
export interface FooData extends z.infer<typeof FooSchema> {}
