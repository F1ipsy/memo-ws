import Fastify from "fastify";
import { PrismaClient } from "@prisma/client";
import fastifyCors from "@fastify/cors";
import multipart from "@fastify/multipart";
import fastifyStatic from "@fastify/static";
import { join, resolve } from 'node:path'
import util from "util";
import { pipeline } from "stream";
import categoryRoutes from "./routes/category.routes.js";
import cardRoutes from "./routes/card.routes.js";

export const prisma = new PrismaClient();
export const pump = util.promisify(pipeline);
export const __dirname = import.meta.dirname;

const fastify = Fastify({
	logger: true,
});

fastify.get("/storage/:fileName", async (request, reply) => {
	const { fileName } = request.params;
	return reply.sendFile(fileName)
})

// Run the server!
try {
	fastify.register(fastifyCors);
	fastify.register(multipart, {limits: {fileSize: 1024*1024*10}});
	fastify.register(fastifyStatic, {
		root: join(resolve(__dirname, ".."), "storage"),
	});
	fastify.register(categoryRoutes, { prefix: "/categories" });
	fastify.register(cardRoutes, { prefix: "/cards" });
	await fastify.listen({ port: 3000, host: "192.168.100.35" });
} catch (err) {
	fastify.log.error(err);
	process.exit(1);
}
