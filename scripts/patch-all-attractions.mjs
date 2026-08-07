/**
 * Apply city-style UX to all content/attractions/*.yml:
 * - short hero + form/catalog CTAs
 * - "About the place" quote + dashTitle after hero
 * - routeMap with single stop = this attraction (coords from lat/lng)
 * - end CTA with image + form + catalog
 *
 * Idempotent. Usage: node scripts/patch-all-attractions.mjs
 */
import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";

const DIR = path.join("content", "attractions");

const COUNTRY_NAME = {
	uzbekistan: { en: "Uzbekistan", ru: "Узбекистан", uz: "Oʻzbekiston" },
	kazakhstan: { en: "Kazakhstan", ru: "Казахстан", uz: "Qozogʻiston" },
	kyrgyzstan: { en: "Kyrgyzstan", ru: "Кыргызстан", uz: "Qirgʻiziston" },
	tajikistan: { en: "Tajikistan", ru: "Таджикистан", uz: "Tojikiston" },
	turkmenistan: {
		en: "Turkmenistan",
		ru: "Туркменистан",
		uz: "Turkmaniston"
	}
};

const L = (en, ru, uz) => ({ en, ru, uz });

function firstSentence(text) {
	if (!text || typeof text !== "string") return "";
	const cleaned = text.replace(/\s+/g, " ").trim();
	const match = cleaned.match(/^(.+?[.!?])(?:\s|$)/);
	return match ? match[1] : cleaned.slice(0, 220);
}

function locBlock(obj, indent) {
	const pad = " ".repeat(indent);
	return ["en", "ru", "uz"]
		.map((code) => `${pad}"${code}": ${JSON.stringify(obj[code] ?? "")}`)
		.join("\n");
}

function dashTitleYaml(title, description, indent) {
	const p = " ".repeat(indent);
	return `${p}- "type": "dashTitle"
${p}  "title":
${locBlock(title, indent + 4)}
${p}  "description":
${locBlock(description, indent + 4)}`;
}

function quoteYaml(quote, indent) {
	const p = " ".repeat(indent);
	return `${p}- "type": "quote"
${p}  "quote":
${locBlock(quote, indent + 4)}`;
}

function heroActionsYaml() {
	return `    "actions":
      - "type": "form"
        "variant": "default"
        "title":
          "en": "Request a tour"
          "ru": "Запросить тур"
          "uz": "Turni so‘rash"
      - "type": "link"
        "variant": "secondary"
        "title":
          "en": "Open catalog"
          "ru": "Открыть каталог"
          "uz": "Katalogni ochish"
        "href": "/tours"`;
}

function resolveSlug(doc, file) {
	if (typeof doc.slug === "string") return doc.slug;
	if (doc.slug && typeof doc.slug === "object" && doc.slug.en) {
		return String(doc.slug.en);
	}
	return file.replace(/\.yml$/, "");
}

function aboutBlockYaml(doc) {
	const title = doc.title;
	const subtitle = doc.subtitle ?? L("", "", "");
	const excerpt = doc.excerpt ?? L("", "", "");
	const why = (doc.blocks || []).find(
		(b) =>
			b.blockType === "regular" &&
			(b.eyebrow?.en === "Why this place" ||
				b.eyebrow?.ru === "Почему это место")
	);
	const whyDesc = why?.description;

	const quote = L(
		firstSentence(excerpt.en) || subtitle.en,
		firstSentence(excerpt.ru) || subtitle.ru,
		firstSentence(excerpt.uz) || subtitle.uz
	);

	const routeBody = whyDesc
		? L(
				firstSentence(whyDesc.en) || whyDesc.en || excerpt.en,
				firstSentence(whyDesc.ru) || whyDesc.ru || excerpt.ru,
				firstSentence(whyDesc.uz) || whyDesc.uz || excerpt.uz
			)
		: L(excerpt.en || subtitle.en, excerpt.ru || subtitle.ru, excerpt.uz || subtitle.uz);

	const productBody = L(
		`Keep this stop clear on the map and in the day plan — ${subtitle.en}.`,
		`Держите эту остановку понятной на карте и в плане дня — ${subtitle.ru}.`,
		`Bu bekatni xaritada va kun rejasida aniq tuting — ${subtitle.uz}.`
	);

	const whoBody = L(
		`Agencies and travellers who need ${title.en} as a readable stop — honest timing and a clear place on the route.`,
		`Агентствам и путешественникам, которым нужен ${title.ru} как читаемая остановка — честное время и понятное место в маршруте.`,
		`Agentliklar va sayohatchilar uchun ${title.uz} o‘qiladigan bekat — halol vaqt va marshrutda aniq joy.`
	);

	return `  - "blockType": "regular"
    "eyebrow":
      "en": "About"
      "ru": "О месте"
      "uz": "Joy haqida"
    "title":
${locBlock(title, 6)}
    "rows":
      - "ratio": "2:1"
        "left":
${quoteYaml(quote, 10)}
${dashTitleYaml(
	L("How the stop works", "Как устроена остановка", "Bekat qanday ishlaydi"),
	routeBody,
	10
)}
        "right":
${dashTitleYaml(
	L("What holds the product", "Что держит продукт", "Mahsulotni nima ushlab turadi"),
	productBody,
	10
)}
${dashTitleYaml(L("Who it is for", "Для кого это", "Kim uchun"), whoBody, 10)}
`;
}

function routeMapBlockYaml(doc, slug) {
	const title = doc.title;
	const subtitle = doc.subtitle ?? L("", "", "");
	const lat = Number(doc.latitude);
	const lng = Number(doc.longitude);

	if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
		throw new Error(`missing coordinates for ${slug}`);
	}

	return `  - "blockType": "routeMap"
    "eyebrow":
      "en": "On the map"
      "ru": "На карте"
      "uz": "Xaritada"
    "title":
${locBlock(
	L(
		`Where ${title.en} sits on the route`,
		`Где ${title.ru} стоит на маршруте`,
		`${title.uz} marshrutda qayerda`
	),
	6
)}
    "description":
${locBlock(
	L(
		`One clear point for ${title.en} — ${subtitle.en}.`,
		`Одна понятная точка для «${title.ru}» — ${subtitle.ru}.`,
		`${title.uz} uchun bitta aniq nuqta — ${subtitle.uz}.`
	),
	6
)}
    "mapPanel":
      "eyebrow":
        "en": "Place"
        "ru": "Место"
        "uz": "Joy"
      "title":
${locBlock(title, 8)}
      "description":
${locBlock(
	L(
		"The map pin marks this attraction so the stop stays readable in the day plan.",
		"Точка на карте отмечает эту достопримечательность, чтобы остановка оставалась читаемой в плане дня.",
		"Xarita nuqtasi shu diqqatga sazovor joyni belgilaydi — bekat kun rejasida o‘qiladigan bo‘lib qolishi uchun."
	),
	8
)}
      "linkLabel":
        "en": "Open map"
        "ru": "Открыть карту"
        "uz": "Xaritani ochish"
    "mapCenter":
      "latitude": ${lat}
      "longitude": ${lng}
    "zoom": 14
    "stops":
      - "entityType": "attraction"
        "entitySlug": ${JSON.stringify(slug)}
`;
}

function ctaBlockYaml(doc) {
	const title = doc.title;
	const country = COUNTRY_NAME[doc.country] ?? {
		en: "Central Asia",
		ru: "Центральная Азия",
		uz: "Markaziy Osiyo"
	};
	const image = doc.heroImage || doc.blocks?.[0]?.image || "";

	return `  - "blockType": "cta"
    "image": ${JSON.stringify(image)}
    "eyebrow":
      "en": "On request"
      "ru": "Под запрос"
      "uz": "So‘rov bo‘yicha"
    "title":
      "en": ${JSON.stringify(`Add ${title.en} to your ${country.en} programme`)}
      "ru": ${JSON.stringify(`Добавьте «${title.ru}» в программу (${country.ru})`)}
      "uz": ${JSON.stringify(`${title.uz}ni ${country.uz} dasturingizga qo‘shing`)}
    "description":
      "en": "We help agencies place this stop with realistic timing — without rushing the places that matter."
      "ru": "Помогаем агентствам поставить эту остановку с реалистичным таймингом — без спешки там, где важны места."
      "uz": "Agentliklarga bu bekatni real vaqt bilan qo‘yishda yordam beramiz — muhim joylarni shoshiltirmasdan."
    "actions":
      - "type": "form"
        "variant": "default"
        "title":
          "en": "Discuss the route"
          "ru": "Обсудить маршрут"
          "uz": "Marshrutni muhokama qilish"
      - "type": "link"
        "variant": "secondary"
        "title":
          "en": "Open catalog"
          "ru": "Открыть каталог"
          "uz": "Katalogni ochish"
        "href": "/tours"
`;
}

function patchHero(source, doc) {
	const subtitle = doc.subtitle ?? doc.title;
	const shortDesc = `    "description":
${locBlock(subtitle, 6)}
${heroActionsYaml()}`;

	const heroDescPattern =
		/("blockType": "hero"[\s\S]*?"title":\s*\n(?:\s*"[a-z]{2}":[^\n]*\n){3})(\s*"description":[\s\S]*?)(?=\n  - "blockType":)/;

	if (!heroDescPattern.test(source)) {
		throw new Error("hero description block not found");
	}

	return source.replace(heroDescPattern, `$1${shortDesc}\n`);
}

function stripInjectedBlocks(source) {
	// Remove previously injected About + routeMap pair (or either alone)
	let next = source.replace(
		/\n  - "blockType": "regular"\n    "eyebrow":\n      "en": "About"\n      "ru": "О месте"\n[\s\S]*?(?=\n  - "blockType":)/,
		"\n"
	);
	next = next.replace(
		/\n  - "blockType": "routeMap"\n    "eyebrow":\n      "en": "On the map"\n[\s\S]*?(?=\n  - "blockType":)/,
		"\n"
	);
	return next;
}

function insertAboutAndMap(source, doc, slug) {
	const inject = `${aboutBlockYaml(doc)}${routeMapBlockYaml(doc, slug)}`;

	if (!source.includes('"blockType": "hero"')) {
		throw new Error("hero not found");
	}

	// Insert after hero block (first subsequent sibling block)
	const heroEnd = source.search(
		/\n  - "blockType": "hero"[\s\S]*?(?=\n  - "blockType":)/
	);
	if (heroEnd < 0) throw new Error("cannot find end of hero");

	const afterHero = source.search(/\n  - "blockType": (?!"hero")/);
	// Find first block after hero
	const match = source.match(
		/\n  - "blockType": "hero"[\s\S]*?\n(?=  - "blockType": )/
	);
	if (!match) throw new Error("cannot locate insert point after hero");

	const idx = match.index + match[0].length;
	return source.slice(0, idx) + inject + source.slice(idx);
}

function patchCta(source, doc) {
	const ctaYaml = ctaBlockYaml(doc).trimEnd();
	const ctaPattern = /\n  - "blockType": "cta"\n[\s\S]*?(?=\n"seo":)/;

	if (ctaPattern.test(source)) {
		return source.replace(ctaPattern, `\n${ctaYaml}\n`);
	}

	if (!source.includes('\n"seo":')) {
		throw new Error("seo block not found");
	}

	return source.replace(/\n"seo":/, `\n${ctaYaml}\n"seo":`);
}

let ok = 0;
let failed = 0;

function patchUnquotedStub(filePath, file) {
	const source = fs.readFileSync(filePath, "utf8");
	const doc = YAML.parse(source);
	const slug = resolveSlug(doc, file);
	const subtitle = doc.subtitle ?? doc.title;
	const heroImage = doc.heroImage || "";
	const country = doc.country;
	const region = doc.region;
	const city = doc.city;

	const kept = (doc.blocks || []).filter(
		(b) => b.blockType !== "hero" && b.blockType !== "cta"
	);

	const keptYaml =
		kept.length > 0
			? YAML.stringify(kept, { lineWidth: 0 })
					.split("\n")
					.map((line) => (line ? `  ${line}` : line))
					.join("\n")
					.replace(/^  - /gm, "  - ")
			: "";

	// Convert kept array dump: YAML.stringify([{...}]) produces "- blockType: ..."
	const keptBlocks =
		kept.length > 0
			? kept
					.map((block) => {
						const dumped = YAML.stringify([block], { lineWidth: 0 }).trimEnd();
						return dumped
							.split("\n")
							.map((line) => `  ${line}`)
							.join("\n");
					})
					.join("\n")
			: "";

	const out = `# Patched attraction stub (quoted seed format)
"slug":
${locBlock(typeof doc.slug === "object" ? doc.slug : L(slug, slug, slug), 2)}
"title":
${locBlock(doc.title, 2)}
"subtitle":
${locBlock(subtitle, 2)}
"excerpt":
${locBlock(doc.excerpt ?? subtitle, 2)}
"heroImage": ${JSON.stringify(heroImage)}
"blocks":
  - "blockType": "hero"
    "image": ${JSON.stringify(heroImage)}
    "imageAlt":
${locBlock(doc.title, 6)}
    "title":
${locBlock(doc.title, 6)}
    "description":
${locBlock(subtitle, 6)}
${heroActionsYaml()}
${aboutBlockYaml(doc)}${routeMapBlockYaml(doc, slug)}${keptBlocks ? `${keptBlocks}\n` : ""}${ctaBlockYaml(doc)}
"seo":
  "metaTitle":
${locBlock(doc.seo?.metaTitle ?? L(`${doc.title.en} | TourLink`, `${doc.title.ru} | TourLink`, `${doc.title.uz} | TourLink`), 4)}
  "metaDescription":
${locBlock(doc.seo?.metaDescription ?? doc.excerpt ?? subtitle, 4)}
  "structuredDataType": ${JSON.stringify(doc.seo?.structuredDataType ?? "TouristAttraction")}
"status":
  "showInSitemap": ${doc.status?.showInSitemap !== false}
  "noindex": ${Boolean(doc.status?.noindex)}
  "hideFromNavigation": ${Boolean(doc.status?.hideFromNavigation)}
  "publishedAt": ${JSON.stringify(doc.status?.publishedAt ?? "2026-08-01")}
"country": ${JSON.stringify(country)}
"region": ${JSON.stringify(region)}
"city": ${JSON.stringify(city)}
"type": ${JSON.stringify(doc.type ?? "LANDMARK")}
"importance": ${JSON.stringify(doc.importance ?? "RECOMMENDED")}
"latitude": ${Number(doc.latitude)}
"longitude": ${Number(doc.longitude)}
`;

	fs.writeFileSync(filePath, out);
}

for (const file of fs.readdirSync(DIR).filter((f) => f.endsWith(".yml")).sort()) {
	const filePath = path.join(DIR, file);
	let source = fs.readFileSync(filePath, "utf8");
	const doc = YAML.parse(source);
	const slug = resolveSlug(doc, file);

	try {
		// Already fully patched?
		if (
			source.includes('"ru": "О месте"') &&
			source.includes('"en": "On the map"') &&
			source.includes('"type": "form"')
		) {
			console.log("skip", file);
			ok++;
			continue;
		}

		source = patchHero(source, doc);
		source = stripInjectedBlocks(source);
		source = insertAboutAndMap(source, doc, slug);
		source = patchCta(source, doc);
		fs.writeFileSync(filePath, source);
		console.log("patched", file);
		ok++;
	} catch (error) {
		try {
			patchUnquotedStub(filePath, file);
			console.log("patched-stub", file);
			ok++;
		} catch (stubError) {
			console.error("FAIL", file, error.message, "/", stubError.message);
			failed++;
		}
	}
}

console.log(`Done: ${ok} patched, ${failed} failed`);
if (failed) process.exit(1);
