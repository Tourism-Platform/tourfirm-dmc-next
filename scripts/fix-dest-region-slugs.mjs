/**
 * Fix outdated Uzbekistan region slugs in destination hrefs.
 * Usage: node scripts/fix-dest-region-slugs.mjs
 */
import fs from "node:fs";
import path from "node:path";

function walk(dir, acc = []) {
	for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
		const p = path.join(dir, e.name);
		if (e.isDirectory()) walk(p, acc);
		else if (e.name.endsWith(".yml")) acc.push(p);
	}
	return acc;
}

const REPLACERS = [
	{
		re: /\/destinations\/uzbekistan\/tashkent-and-chimgan(?=\/|["'\s]|$)/g,
		to: "/destinations/uzbekistan/tashkent-region"
	},
	{
		re: /\/destinations\/uzbekistan\/bukhara(?!-region)(?=\/|["'\s]|$)/g,
		to: "/destinations/uzbekistan/bukhara-region"
	},
	{
		re: /\/destinations\/uzbekistan\/samarkand(?!-region)(?=\/|["'\s]|$)/g,
		to: "/destinations/uzbekistan/samarkand-region"
	},
	{
		re: /\/destinations\/uzbekistan\/khorezm(?!-region)(?=\/|["'\s]|$)/g,
		to: "/destinations/uzbekistan/khorezm-region"
	}
];

let filesChanged = 0;
let totalRepl = 0;
const byDir = {};

for (const file of walk("content")) {
	let source = fs.readFileSync(file, "utf8");
	const original = source;
	let n = 0;

	for (const { re, to } of REPLACERS) {
		const matches = source.match(re);
		if (matches?.length) {
			n += matches.length;
			source = source.replace(re, to);
		}
	}

	if (source !== original) {
		fs.writeFileSync(file, source);
		filesChanged++;
		totalRepl += n;
		const dir = file.split(path.sep)[1];
		byDir[dir] = (byDir[dir] || 0) + 1;
	}
}

console.log({ filesChanged, totalRepl, byDir });
