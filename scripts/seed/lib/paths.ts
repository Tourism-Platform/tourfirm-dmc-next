import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT_DIR = path.resolve(
	path.dirname(fileURLToPath(import.meta.url)),
	"../../.."
);

export const CONTENT_DIR = path.join(ROOT_DIR, "content");
export const UI_TEXTS_DIR = path.join(CONTENT_DIR, "ui-texts");
export const CATALOG_PAGE_FILE = path.join(CONTENT_DIR, "catalog.yml");
