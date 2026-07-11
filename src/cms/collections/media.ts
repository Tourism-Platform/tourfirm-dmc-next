import type { CollectionConfig } from "payload";

import {
	MEDIA_CATEGORY_OPTIONS,
	MEDIA_LICENSE_OPTIONS,
	MEDIA_RIGHTS_STATUS_OPTIONS
} from "./media.constants";

export const MEDIA_UPLOAD_DIR = "media/uploads";

export const Media: CollectionConfig = {
	slug: "media",
	admin: {
		useAsTitle: "filename",
		defaultColumns: ["filename", "alt", "category", "updatedAt"],
		listSearchableFields: ["filename", "alt", "caption", "tags"]
	},
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
			name: "alt",
			type: "text",
			localized: true,
			index: true
		},
		{
			name: "caption",
			type: "textarea",
			localized: true,
			index: true
		},
		{
			name: "tags",
			type: "text",
			hasMany: true,
			index: true
		},
		{
			name: "credit",
			type: "text"
		},
		{
			name: "source",
			type: "text",
			admin: {
				description: "Where the image was obtained (not the seed path)."
			}
		},
		{
			name: "category",
			type: "select",
			options: [...MEDIA_CATEGORY_OPTIONS],
			index: true,
			admin: {
				position: "sidebar"
			}
		},
		{
			name: "license",
			type: "select",
			options: [...MEDIA_LICENSE_OPTIONS],
			index: true,
			admin: {
				position: "sidebar"
			}
		},
		{
			name: "rightsStatus",
			type: "select",
			options: [...MEDIA_RIGHTS_STATUS_OPTIONS],
			index: true,
			admin: {
				position: "sidebar"
			}
		},
		{
			name: "sourcePath",
			type: "text",
			unique: true,
			index: true,
			admin: {
				position: "sidebar",
				readOnly: true,
				disableListColumn: true,
				disableListFilter: true,
				description:
					"Seed source path relative to public/, e.g. assets/images/city/samarkand.jpg"
			}
		}
	]
};
