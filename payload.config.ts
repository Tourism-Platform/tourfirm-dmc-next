import path from "node:path";
import { fileURLToPath } from "node:url";

import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { buildConfig } from "payload";
import sharp from "sharp";

import { collections } from "./src/cms/collections";
import { globals } from "./src/cms/globals";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
	editor: lexicalEditor(),
	localization: {
		locales: ["en", "ru", "uz"],
		defaultLocale: "en",
		fallback: true
	},
	collections,
	globals,
	secret: process.env.PAYLOAD_SECRET || "",
	db: postgresAdapter({
		pool: {
			connectionString: process.env.DATABASE_URI || ""
		},
		push: process.env.PAYLOAD_DB_PUSH !== "false"
	}),
	sharp,
	typescript: {
		outputFile: path.resolve(dirname, "src/payload-types.ts")
	},
	admin: {
		user: "users"
	}
});
