import { z } from "zod";

// --product,get,products,body,DATAob
export const ProductSchema = z.object({
  name: z.string().min(4).max(25),
  price: z.number().min(1).max(9999999999),
  is_available: z.boolean().default(true),
  description: z.string().min(10).max(300),
  category: z.string().min(4).max(25),
});

// --/product,get,products,body,CreateData
export const MenuSchema = z.object({
  name: z.string().min(4).max(25),
  price: z.number().min(1).max(9999999999),
  is_available: z.boolean().default(true),
  description: z.string().min(10).max(300),
  category: z.string().min(4).max(25),
});

export interface MenuSchemaData extends z.infer<typeof MenuSchema> {}
export interface MenuSchemaData extends z.infer<typeof MenuSchema> {}
export interface MenuSchemaData extends z.infer<typeof MenuSchema> {}

export interface MenuSchemaData extends z.infer<typeof MenuSchema> {}
export interface MenuSchemaData extends z.infer<typeof MenuSchema> {}
export interface MenuSchemaData extends z.infer<typeof MenuSchema> {}

export interface ProductSchemaData extends z.infer<typeof ProductSchema> {}
export interface MenuSchemaData extends z.infer<typeof MenuSchema> {}
export interface ProductSchemaData extends z.infer<typeof ProductSchema> {}
export interface MenuSchemaData extends z.infer<typeof MenuSchema> {}

export interface ProductSchemaData extends z.infer<typeof ProductSchema> { }
export interface MenuSchemaData extends z.infer<typeof MenuSchema> { }