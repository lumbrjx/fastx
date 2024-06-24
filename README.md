# fastx

Fastx is a fastify route generator tool i made to skip the repeatitive process of creating new route files and copy code here and there. Thus, this tool handles it for me.


## how to setup the tool

use curl to download the binary file:

```
curl -o fastx https://raw.githubusercontent.com/lumbrjx/fast-z/main/fastx
```
now you can check ``fastx -h show`` for user guide.



first you have to initialize the tool in your fastify project root folder by running:

```
fastx -i attach
```

you will have to specify the domains parent folder path e.g. /src/domains. the tool will generate a fastx.toml file in the same dir. there you can edit the domainPath field if you want to change the domains parent folder destination.

## how to generate routes

You need to create a folder in the domains folder u specified earlier, then add a model.def.ts to it.
the model.def.ts file will contain the routes zod schemas.
each schema decalration should have a specific comment like this:

```ts
// --product,get,products,body,getProducts
export const ProductSchema = z.object({
  name: z.string().min(4).max(25),
  price: z.number().min(1).max(9999999999),
  is_available: z.boolean().default(true),
  description: z.string().min(10).max(300),
  category: z.string().min(4).max(25),
});
```
### structure:
- product: the route endpoint
- get: the http method
- products: route prefix
- body: type of body (body, queryParams...)
- getProducts: file name

to generate a route simply run (in the root dir):

```
fastx -g <folder name>
```
in addition you can ignore some schemas by adding 'ign':

```ts
// ign --product,get,products,body,getProducts
export const ProductSchema = z.object({
  name: z.string().min(4).max(25),
  price: z.number().min(1).max(9999999999),
  is_available: z.boolean().default(true),
  description: z.string().min(10).max(300),
  category: z.string().min(4).max(25),
});
```





