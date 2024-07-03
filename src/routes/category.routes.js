import { prisma } from "../main.js";
import { categorySchema } from "../schemas/category.schema.js";

export default async function categoryRoutes(fastify) {
	fastify.get("/", async (_, reply) => {
		reply.send(await prisma.category.findMany({orderBy: {id: 'asc'}}));
	});

	fastify.post("/", categorySchema, async (request, reply) => {
		const { title } = request.body;
		const newCategory = await prisma.category.create({
			data: {
				title,
			},
		});
		return reply.send(newCategory);
	});

	fastify.get("/:id", async (request, reply) => {
		const { id } = request.params;
		const category = await prisma.category.findUnique({
			where: {
				id: +id,
			},
		});
		return reply.send(category);
	});

	fastify.patch("/:id", categorySchema, async (request, reply) => {
		const { id } = request.params;
		const { title } = request.body;
		await prisma.category.update({
			where: {
				id: +id,
			},
			data: {
				title,
			},
		});
		return reply.send({ success: true, message: "Игра обновлена" });
	});

	fastify.delete("/:id", async (request, reply) => {
		const { id } = request.params;
		await prisma.category.delete({
			where: {
				id: +id,
			},
		});
		return reply.send({ success: true, message: "Категория удалена" });
	});
}
