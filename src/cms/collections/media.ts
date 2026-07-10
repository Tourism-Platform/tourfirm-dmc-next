import type { CollectionConfig } from "payload";

export const MEDIA_UPLOAD_DIR = "media/uploads";

export const Media: CollectionConfig = {
	slug: "media",
	access: {
		read: () => true
	},
	upload: {
		staticDir: MEDIA_UPLOAD_DIR,
		mimeTypes: [
			"image/jpeg",
			"image/png",
			"image/webp",
			"image/avif",
			"image/gif",
			"image/svg+xml"
		]
	},
	fields: [
		{
			name: "sourcePath",
			type: "text",
			unique: true,
			index: true,
			admin: {
				readOnly: true,
				description:
					"Seed source path relative to public/, e.g. assets/images/city/samarkand.jpg"
			}
		},
		{
			name: "alt",
			type: "text",
			localized: true
		}
	]
};
