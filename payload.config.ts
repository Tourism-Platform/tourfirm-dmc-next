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
			connectionString: process.env.DATABASE_URI || "",
			...(process.env.PAYLOAD_SEED_MODE === "true"
				? {
					// min 2: connect() keeps one client for error listener (see db-postgres connect.js)
					max: 2,
					maxUses: 250,
					idleTimeoutMillis: 0,
					connectionTimeoutMillis: 300_000,
					keepAlive: true,
					options: "-c statement_timeout=0 -c idle_in_transaction_session_timeout=0"
				}
				: {})
		},
		push: process.env.PAYLOAD_DB_PUSH !== "false"
	}),
	sharp,
	typescript: {
		outputFile: path.resolve(dirname, "src/payload-types.ts")
	},
	admin: {
		user: "users",
		theme: "all",
		meta: {
			titleSuffix: "- TourLink CMS",
			icons: [
				{
					rel: "icon",
					type: "image/svg+xml",
					url: "/assets/images/logo.svg"
				}
			]
		},
		components: {
			graphics: {
				Logo: "@/cms/admin/graphics/admin-logo#AdminLogo",
				Icon: "@/cms/admin/graphics/admin-icon#AdminIcon"
			},
			actions: ["@/cms/admin/admin-header-actions#AdminHeaderActions"],
			afterLogin: ["@/cms/admin/admin-theme-toggle#AdminThemeToggle"],
			afterNavLinks: ["@/cms/admin/domain-pages-nav-links#DomainPagesNavLinks"]
		}
	}
});
