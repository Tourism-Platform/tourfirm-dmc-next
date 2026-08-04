/**
 * Apply country-style UX to all content/regions/*.yml:
 * - short hero + form/catalog CTAs
 * - "About the region" quote + dashTitle block after hero
 * - fill empty mapPanel.description
 * - end CTA with image + form + catalog
 *
 * Idempotent. Usage: node scripts/patch-all-regions.mjs
 */
import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";

const DIR = path.join("content", "regions");

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
        "href": "/catalog"`;
}

function aboutBlockYaml(doc) {
	const title = doc.title;
	const subtitle = doc.subtitle ?? L("", "", "");
	const excerpt = doc.excerpt ?? L("", "", "");
	const routeMap = doc.blocks?.find((b) => b.blockType === "routeMap");
	const routeDesc = routeMap?.description ?? excerpt;
	const asideDesc = routeMap?.aside?.description;

	const quote = L(
		firstSentence(excerpt.en) || subtitle.en,
		firstSentence(excerpt.ru) || subtitle.ru,
		firstSentence(excerpt.uz) || subtitle.uz
	);

	const routeBody = L(
		routeDesc.en || excerpt.en,
		routeDesc.ru || excerpt.ru,
		routeDesc.uz || excerpt.uz
	);

	const productBody = asideDesc
		? L(asideDesc.en, asideDesc.ru, asideDesc.uz)
		: L(
				`Keep one clear anchor, then add extensions that fit the season — ${subtitle.en}.`,
				`Один понятный якорь, затем расширения под сезон — ${subtitle.ru}.`,
				`Bitta aniq tayanch, keyin mavsumga mos kengaytmalar — ${subtitle.uz}.`
			);

	const whoBody = L(
		`Agencies and travellers who need ${title.en} as a readable stop — strong places, honest pacing, and logistics that hold.`,
		`Агентствам и путешественникам, которым нужен ${title.ru} как читаемая остановка — сильные места, честный темп и логистика, которая держит.`,
		`Agentliklar va sayohatchilar uchun ${title.uz} o‘qiladigan bekat — kuchli joylar, halol sur’at va ushlab turadigan logistika.`
	);

	return `  - "blockType": "regular"
    "eyebrow":
      "en": "About"
      "ru": "О регионе"
      "uz": "Hudud haqida"
    "title":
${locBlock(title, 6)}
    "rows":
      - "ratio": "2:1"
        "left":
${quoteYaml(quote, 10)}
${dashTitleYaml(
	L("How the route works", "Как устроен маршрут", "Marshrut qanday ishlaydi"),
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
      "en": ${JSON.stringify(`Build a ${title.en} stop into your ${country.en} programme`)}
      "ru": ${JSON.stringify(`Встройте остановку «${title.ru}» в программу (${country.ru})`)}
      "uz": ${JSON.stringify(`${title.uz} bekatini ${country.uz} dasturingizga qo‘shing`)}
    "description":
      "en": "We help agencies set a realistic pace and choose the right extensions — without rushing the places that matter."
      "ru": "Помогаем агентствам выстроить реалистичный темп и выбрать нужные расширения — без спешки там, где важны места."
      "uz": "Agentliklarga real sur’at va kerakli kengaytmalarni tanlashda yordam beramiz — muhim joylarni shoshiltirmasdan."
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
        "href": "/catalog"
`;
}

function patchHero(source, doc) {
	const subtitle = doc.subtitle ?? doc.title;
	const shortDesc = `    "description":
${locBlock(subtitle, 6)}
${heroActionsYaml()}`;

	// Replace from description through optional note, up to next sibling block
	const heroDescPattern =
		/("blockType": "hero"[\s\S]*?"title":\s*\n(?:\s*"[a-z]{2}":[^\n]*\n){3})(\s*"description":[\s\S]*?)(?=\n  - "blockType":)/;

	if (!heroDescPattern.test(source)) {
		throw new Error("hero description block not found");
	}

	return source.replace(heroDescPattern, `$1${shortDesc}\n`);
}

function ensureAbout(source, doc) {
	if (source.includes('"ru": "О регионе"')) {
		// Refresh about block for consistency
		source = source.replace(
			/\n  - "blockType": "regular"\n    "eyebrow":\n      "en": "About"\n[\s\S]*?(?=\n  - "blockType": "routeMap")/,
			"\n"
		);
	}

	if (!source.includes('"blockType": "routeMap"')) {
		throw new Error("routeMap not found");
	}

	return source.replace(
		/\n  - "blockType": "routeMap"/,
		`\n${aboutBlockYaml(doc)}  - "blockType": "routeMap"`
	);
}

function fillMapPanelDescription(source, doc) {
	const routeMap = doc.blocks?.find((b) => b.blockType === "routeMap");
	if (!routeMap?.mapPanel) return source;

	const current = routeMap.mapPanel.description;
	const empty =
		!current ||
		(!String(current.en || "").trim() &&
			!String(current.ru || "").trim() &&
			!String(current.uz || "").trim());

	if (!empty) return source;

	const fallback = routeMap.description ?? doc.subtitle ?? doc.excerpt;
	const desc = L(
		fallback.en || "",
		fallback.ru || "",
		fallback.uz || ""
	);

	return source.replace(
		/("mapPanel":[\s\S]*?"title":\s*\n(?:\s*"[a-z]{2}":[^\n]*\n){3}\s*"description":\s*\n)\s*"en": ""\s*\n\s*"ru": ""\s*\n\s*"uz": ""/,
		`$1${locBlock(desc, 8)}`
	);
}

function patchCta(source, doc) {
	const ctaYaml = ctaBlockYaml(doc).trimEnd();

	// Replace the last cta block before seo
	const ctaPattern =
		/\n  - "blockType": "cta"\n[\s\S]*?(?=\n"seo":)/;

	if (!ctaPattern.test(source)) {
		throw new Error("cta block not found before seo");
	}

	return source.replace(ctaPattern, `\n${ctaYaml}\n`);
}

let ok = 0;
let failed = 0;

for (const file of fs.readdirSync(DIR).filter((f) => f.endsWith(".yml")).sort()) {
	const filePath = path.join(DIR, file);
	let source = fs.readFileSync(filePath, "utf8");
	const doc = YAML.parse(source);

	try {
		source = patchHero(source, doc);
		source = ensureAbout(source, doc);
		source = fillMapPanelDescription(source, doc);
		source = patchCta(source, doc);
		fs.writeFileSync(filePath, source);
		console.log("patched", file);
		ok++;
	} catch (error) {
		console.error("FAIL", file, error.message);
		failed++;
	}
}

console.log(`Done: ${ok} patched, ${failed} failed`);
if (failed) process.exit(1);
