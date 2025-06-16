// server.js
import Fastify from 'fastify';
import { PrismaClient } from "@prisma/client";
import fastifyCors from "@fastify/cors";
import multipart from "@fastify/multipart";
import fastifyStatic from "@fastify/static";
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import util from "util";
import { pipeline } from "stream";
import categoryRoutes from "./src/routes/category.routes.js";
import cardRoutes from "./src/routes/card.routes.js";

export const prisma = new PrismaClient();
export const pump = util.promisify(pipeline);

// Правильное определение __dirname для ES модулей
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Создаем экземпляр Fastify
const fastify = Fastify({
	logger: true // Включаем логгер
});

fastify.get("/storage/:fileName", async (request, reply) => {
	const { fileName } = request.params;
	return reply.sendFile(fileName);
});

// Роут для корневого URL
fastify.get('/', async (request, reply) => {
	return { message: 'Hello World!' };
});

// Запускаем сервер
const start = async () => {
	try {
		fastify.register(fastifyCors);
		fastify.register(multipart, {limits: {fileSize: 1024*1024*10}});
		fastify.register(fastifyStatic, {
			root: join(resolve(__dirname, "storage")),
		});
		fastify.register(categoryRoutes, { prefix: "/categories" });
		fastify.register(cardRoutes, { prefix: "/cards" });
		await fastify.listen({ port: 3000 });
		console.log(`СЕРВЕР ЗАПУЩЕН НА ПОРТУ ${fastify.server.address().port}`);
	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}
};

start();