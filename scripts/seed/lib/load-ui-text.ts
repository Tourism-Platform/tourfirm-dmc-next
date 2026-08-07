import fs from "node:fs/promises";
import path from "node:path";

import { UI_TEXTS_DIR } from "./paths.js";

export async function hasUiTextFile(
	locale: string,
	fileName: string
): Promise<boolean> {
	try {
		await fs.access(path.join(UI_TEXTS_DIR, locale, fileName));
		return true;
	} catch {
		return false;
	}
}

export async function loadUiTextFile<T>(
	locale: string,
	fileName: string
): Promise<T> {
	const filePath = path.join(UI_TEXTS_DIR, locale, fileName);
	const raw = await fs.readFile(filePath, "utf8");

	return JSON.parse(raw) as T;
}
