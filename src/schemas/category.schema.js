export const categorySchema = {
	schema: {
		body: {
			type: "object",
			properties: {
				title: {
					type: "string",
					minLength: 4,
				},
			},
			required: ["title"],
		},
	},
};
