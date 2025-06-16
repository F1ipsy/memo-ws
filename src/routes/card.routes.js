import { prisma } from "../../index.js";
import { pump } from "../../index.js";
import fs from "fs";
import crypto from "node:crypto";

export default async function cardRoutes(fastify) {
	fastify.get("/", async (request, reply) => {
		const categoryId = +request.query.categoryId;
		if (!categoryId)
			return reply.status(400).send({
				success: false,
				message: "category id is required",
			});
		const cards = await prisma.card.findMany({
			where: {
				categoryId,
			},
			orderBy: { id: "asc" },
		});
		return reply.send(cards);
	});

	fastify.get("/:id", async (request, reply) => {
		const { id } = request.params;
		const card = await prisma.card.findUnique({
			where: {
				id: Number(id),
			},
		});
		return reply.send(card);
	});

	fastify.post("/", async (request, reply) => {
		const body = {};
		const parts = request.parts();

		for await (const part of parts) {
			// Получаем файл
			if (part.file) {
				// Сохраняем файл на сервере
				const uniqueName = `${crypto.randomUUID()}-${part.filename}`
				const filePath = `./storage/${uniqueName}`;
				await pump(part.file, fs.createWriteStream(filePath));
				body[part.fieldname] = uniqueName;
			} else {
				body[part.fieldname] = part.value;
			}
		}

		if (
			(await prisma.card.count({
				where: {
					categoryId: +body.categoryId,
				},
			})) < 12
		) {
			// Проверка наличия описания
			if (body.alt.length < 3) {
				return reply.status(400).send({
					succes: false,
					message: "Описание должно содержать минимум 3 символа",
				});
			}

			// Проверка наличия изображения
			if (!body.image) {
				return reply.status(400).send({
					succes: false,
					message: "Выберите изображение для карточки",
				});
			}

			if (body.setting === "alternate" && !body.alternateImage) {
				return reply.status(400).send({
					succes: false,
					message: "Выберите альтернативное изображение для карточки",
				});
			}

			await prisma.card.create({
				data: {
					image: body.image,
					alternateImage:
						body.alternateImage !== ""
							? body.alternateImage
							: "",
					alt: body.alt,
					categoryId: +body.categoryId,
				},
			});

			return reply.send({
				success: true,
				message: "Файл загружен",
			});
		} else {
			return reply.status(400).send({
				succes: false,
				message: "Нельзя добавлять больше 12 карт",
			});
		}
	});

	fastify.patch("/:id", async (request, reply) => {
		const { id } = request.params;
		const body = {};
		const parts = request.parts();

		for await (const part of parts) {
			// Получаем файл
			if (part.file) {
				// Сохраняем файл на сервере
				const uniqueName = `${crypto.randomUUID()}-${part.filename}`
				const filePath = `./storage/${uniqueName}`;
				await pump(part.file, fs.createWriteStream(filePath));
				body[part.fieldname] = uniqueName;
			} else {
				body[part.fieldname] = part.value;
			}
		}

		// Проверка наличия описания
		if (body.alt.length < 3) {
			return reply.status(400).send({
				succes: false,
				message: "Описание должно содержать минимум 3 символа",
			});
		}

		await prisma.card.update({
			where: {
				id: +id,
			},
			data: {
				image: body.image,
				alternateImage:
					body.alternateImage !== ""
						? body.alternateImage
						: "",
				alt: body.alt,
			},
		});

		return reply.send({
			succes: true,
			message: "Карточка обновлена",
		});
	});

	fastify.delete("/:id", async (request, reply) => {
		const { id } = request.params;
		await prisma.card.delete({
			where: {
				id: Number(id),
			},
		});
		return reply.send({
			success: true,
			message: "Карточка удалена",
		});
	});
}
