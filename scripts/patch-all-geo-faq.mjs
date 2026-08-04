/**
 * Insert unique FAQ-style insight cards into all geo content:
 * countries, regions, cities, attractions.
 * UI: regular + destinationInsight (stacked cards), not accordion faq.
 *
 * Idempotent. Usage: node scripts/patch-all-geo-faq.mjs
 */
import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";

const LAYERS = ["countries", "regions", "cities", "attractions"];

const L = (en, ru, uz) => ({ en, ru, uz });

function locBlock(obj, indent) {
	const pad = " ".repeat(indent);
	return ["en", "ru", "uz"]
		.map((code) => `${pad}"${code}": ${JSON.stringify(obj[code] ?? "")}`)
		.join("\n");
}

function resolveSlug(doc, file) {
	if (typeof doc.slug === "string") return doc.slug;
	if (doc.slug && typeof doc.slug === "object" && doc.slug.en) {
		return String(doc.slug.en);
	}
	return file.replace(/\.yml$/, "");
}

function hashSlug(slug) {
	let h = 0;
	for (let i = 0; i < slug.length; i++) {
		h = (h * 31 + slug.charCodeAt(i)) >>> 0;
	}
	return h;
}

function pick(arr, h, salt = 0) {
	return arr[(h + salt) % arr.length];
}

function firstSentence(text) {
	if (!text || typeof text !== "string") return "";
	const cleaned = text.replace(/\s+/g, " ").trim();
	const m = cleaned.match(/^(.+?[.!?])(?:\s|$)/);
	return m ? m[1] : cleaned.slice(0, 180);
}

function nameOf(doc) {
	return {
		en: doc.title?.en ?? "",
		ru: doc.title?.ru ?? "",
		uz: doc.title?.uz ?? ""
	};
}

function subOf(doc) {
	return {
		en: doc.subtitle?.en ?? "",
		ru: doc.subtitle?.ru ?? "",
		uz: doc.subtitle?.uz ?? ""
	};
}

function buildCountryFaq(doc, slug, h) {
	const n = nameOf(doc);
	const s = subOf(doc);
	const nights = pick(
		[
			L("7–10 nights", "7–10 ночей", "7–10 tun"),
			L("8–12 nights", "8–12 ночей", "8–12 tun"),
			L("6–9 nights", "6–9 ночей", "6–9 tun")
		],
		h,
		1
	);
	const q1 = {
		icon: "CircleQuestionMark",
		title: L(
			`How many nights work for a first trip to ${n.en}?`,
			`Сколько ночей оптимально для первой поездки (${n.ru})?`,
			`${n.uz}ga birinchi safar uchun necha tun yetarli?`
		),
		description: L(
			`For a first programme, ${nights.en} usually holds: keep the classic spine readable, then add one extension only if the season and group pace allow it. ${s.en ? `Use “${s.en}” as the brief for what the country actually sells.` : ""}`.trim(),
			`Для первой программы обычно хватает ${nights.ru}: держите классическую линию читаемой и добавляйте одно расширение только если сезон и темп группы позволяют. ${s.ru ? `Ориентир страны — «${s.ru}».` : ""}`.trim(),
			`Birinchi dastur uchun odatda ${nights.uz} yetadi: klassik chiziqni o‘qiladigan tuting, kengaytmani esa mavsum va guruh sur’ati ruxsat bersagina qo‘shing. ${s.uz ? `Mamlakat brifi — «${s.uz}».` : ""}`.trim()
		)
	};
	const q2 = {
		icon: pick(["TrainFront", "Bus", "MapPin"], h, 2),
		title: L(
			`Where are the long transfers in ${n.en}, and how do you soften them?`,
			`Где в маршруте по стране «${n.ru}» длинные переезды и как их смягчить?`,
			`${n.uz} marshrutida uzun ko‘chishlar qayerda va ularni qanday yumshatish mumkin?`
		),
		description: L(
			`Plan long road or rail legs as part of the product, not leftovers between hotels. Evening or overnight moves, buffer mornings, and one clear anchor per day keep ${n.en} sellable for agencies.`,
			`Длинные ж/д или автомобильные участки планируйте как часть продукта, а не как остаток между отелями. Вечерние/ночные переезды, запас утра и один ясный якорь на день делают ${n.ru} удобным для агентств.`,
			`Uzun temiryo‘l yoki avto bo‘limlarni mehmonxona orasidagi qoldiq emas, mahsulot qismi qiling. Kechki/tungi ko‘chish, ertalab zaxirasi va kuniga bitta aniq tayanch ${n.uz}ni agentliklar uchun sotiladigan qiladi.`
		)
	};
	const q3 = {
		icon: pick(["Compass", "Mountain", "Landmark"], h, 3),
		title: L(
			`How do you mix culture and landscape in ${n.en} without overload?`,
			`Как совместить культуру и природу в программе по «${n.ru}» без перегруза?`,
			`${n.uz} dasturida madaniyat va tabiatni ortiqcha yuklamasdan qanday birlashtirish mumkin?`
		),
		description: L(
			`Split the trip into readable chapters: heritage days, then one nature or foothill pause, then return to the main city line. Clients remember clarity more than packing every highlight into one week.`,
			`Делите поездку на читаемые главы: дни наследия, затем одна природная или предгорная пауза, затем возврат к основной городской линии. Клиенты лучше помнят ясность, чем попытку уместить все хайлайты в одну неделю.`,
			`Safarni o‘qiladigan boblarga bo‘ling: meros kunlari, keyin bitta tabiat yoki tog‘oldi pauza, so‘ng asosiy shahar chizig‘iga qaytish. Mijozlar bir haftaga hamma narsani tiqishdan ko‘ra aniqlikni eslaydi.`
		)
	};
	return [q1, q2, q3];
}

function buildRegionFaq(doc, slug, h) {
	const n = nameOf(doc);
	const s = subOf(doc);
	const days = pick(
		[
			L("2–4 days", "2–4 дня", "2–4 kun"),
			L("3–5 days", "3–5 дней", "3–5 kun"),
			L("2–3 days", "2–3 дня", "2–3 kun")
		],
		h,
		1
	);
	return [
		{
			icon: "CircleQuestionMark",
			title: L(
				`How many days does ${n.en} need in a programme?`,
				`Сколько дней нужно региону ${n.ru} в программе?`,
				`${n.uz} hududi dasturda necha kun olishi kerak?`
			),
			description: L(
				`${days.en} usually works if you keep one strong core and treat outer stops as deliberate choices. ${s.en ? `The region brief is “${s.en}”.` : ""}`.trim(),
				`Обычно хватает ${days.ru}, если держать одно сильное ядро, а внешние остановки выбирать осознанно. ${s.ru ? `Кратко о регионе: «${s.ru}».` : ""}`.trim(),
				`Odatda ${days.uz} yetadi — bitta kuchli yadro va tashqi bekatlarni ongli tanlov qiling. ${s.uz ? `Hudud brifi: «${s.uz}».` : ""}`.trim()
			)
		},
		{
			icon: pick(["MapPin", "Compass", "Landmark"], h, 2),
			title: L(
				`What should come before and after ${n.en}?`,
				`Что ставить до и после региона ${n.ru}?`,
				`${n.uz}dan oldin va keyin nima qo‘yish kerak?`
			),
			description: L(
				`Use neighbouring cities as clean handovers: arrive with a calm first night, leave after one completed chapter, and avoid stacking two long transfers on the same day.`,
				`Соседние города держите как чистые стыки: приезжайте со спокойной первой ночью, уезжайте после завершённой главы и не ставьте два длинных переезда в один день.`,
				`Qo‘shni shaharlarni toza ulanish sifatida tuting: sokin birinchi tun bilan keling, yakunlangan bobdan keyin chiqing va bir kunga ikkita uzun ko‘chishni qo‘ymang.`
			)
		},
		{
			icon: pick(["Sun", "CloudSun", "Calendar"], h, 3),
			title: L(
				`What season logic matters most in ${n.en}?`,
				`Какая сезонная логика важнее всего в ${n.ru}?`,
				`${n.uz}da qaysi mavsum mantig‘i eng muhim?`
			),
			description: L(
				`Heat, altitude, road condition, and opening hours change the product more than the brochure list. Build the region around what stays comfortable for the group that week.`,
				`Жара, высота, состояние дорог и часы работы меняют продукт сильнее списка из брошюры. Собирайте регион вокруг того, что комфортно именно этой группе в эту неделю.`,
				`Issiqlik, balandlik, yo‘l holati va ish soatlari broshyura ro‘yxatidan kuchliroq mahsulotni o‘zgartiradi. Hududni shu hafta guruh uchun qulay narsaga qurib chiqing.`
			)
		}
	];
}

function buildCityFaq(doc, slug, h) {
	const n = nameOf(doc);
	const s = subOf(doc);
	const stay = pick(
		[
			L("1–2 nights", "1–2 ночи", "1–2 tun"),
			L("2–3 nights", "2–3 ночи", "2–3 tun"),
			L("one focused city day plus overnight", "один насыщенный городской день плюс ночёвка", "bitta zich shahar kuni va tunash")
		],
		h,
		1
	);
	return [
		{
			icon: "CircleQuestionMark",
			title: L(
				`How long should groups stay in ${n.en}?`,
				`Сколько времени группам стоит проводить в ${n.ru}?`,
				`${n.uz}da guruhlar qancha vaqt o‘tkazishi kerak?`
			),
			description: L(
				`${stay.en} is usually enough when the old core or main anchors get a full walking window. ${s.en ? `City tone: “${s.en}”.` : ""}`.trim(),
				`Обычно хватает ${stay.ru}, если старому центру или главным якорям дать полноценное пешеходное окно. ${s.ru ? `Тон города: «${s.ru}».` : ""}`.trim(),
				`Odatda ${stay.uz} yetadi — eski markaz yoki asosiy tayanchlarga to‘liq piyoda oyna bersangiz. ${s.uz ? `Shahar ohangi: «${s.uz}».` : ""}`.trim()
			)
		},
		{
			icon: pick(["MapPin", "Footprints", "Landmark"], h, 2),
			title: L(
				`Should ${n.en} be a walkable core or a base for day trips?`,
				`${n.ru} — это пешеходное ядро или база для выездов?`,
				`${n.uz} piyoda yadroimi yoki chiqishlar uchun baza?`
			),
			description: L(
				`Start with the compact city walk first. Day trips only after the centre has settled — otherwise the stop feels like a transfer with monuments attached.`,
				`Сначала компактная городская прогулка. Выезды — только после того, как центр «сел»; иначе остановка ощущается как трансфер с памятниками.`,
				`Avval ixcham shahar sayri. Chiqishlar — markaz joylashgandan keyin; aks holda bekat yodgorlikli transferdek tuyuladi.`
			)
		},
		{
			icon: pick(["Hotel", "Moon", "Clock"], h, 3),
			title: L(
				`Where should overnight be relative to ${n.en}'s centre?`,
				`Где лучше ночевать относительно центра ${n.ru}?`,
				`${n.uz} markaziga nisbatan qayerda tunash yaxshi?`
			),
			description: L(
				`Stay close enough for an evening return on foot or a short transfer. That keeps tea, dinner, and a second pass through the lanes easy without burning the next morning.`,
				`Живите достаточно близко, чтобы вечером вернуться пешком или коротким трансфером. Так чай, ужин и второй проход по улицам остаются лёгкими и не сжигают следующее утро.`,
				`Kechqurun piyoda yoki qisqa transfer bilan qaytishga yaqin turing. Choy, kechki ovqat va ko‘chalardan ikkinchi o‘tish oson qoladi, erta tongni yoqib yubormaydi.`
			)
		}
	];
}

function buildAttractionFaq(doc, slug, h) {
	const n = nameOf(doc);
	const s = subOf(doc);
	const city = typeof doc.city === "string" ? doc.city : "";
	const type = typeof doc.type === "string" ? doc.type : "";
	const time = pick(
		[
			L("45–90 minutes", "45–90 минут", "45–90 daqiqa"),
			L("1–2 hours", "1–2 часа", "1–2 soat"),
			L("a focused half-day with buffer", "полдня с запасом", "zaxira bilan yarim kun")
		],
		h,
		1
	);
	const when = pick(
		[
			L("early morning or late afternoon", "рано утром или ближе к вечеру", "erta tong yoki kechga yaqin"),
			L("before the midday heat", "до полуденной жары", "tushlik issiqligidan oldin"),
			L("when the light is soft and queues are lighter", "когда свет мягче и очередей меньше", "yorug‘lik yumshoq va navbat kamroq bo‘lganda")
		],
		h,
		2
	);

	const typeHint =
		type === "MUSEUM"
			? L(
					"Plan ticket timing and indoor pacing.",
					"Заложите время на билеты и спокойный темп внутри.",
					"Chipta va ichki sokin sur’at uchun vaqt qo‘ying."
				)
			: type === "FORTRESS" || type === "LANDMARK"
				? L(
						"Leave time for walls, viewpoints, and the walk between courtyards.",
						"Оставьте время на стены, смотровые и переход между дворами.",
						"Devor, manzara va hovlilar orasidagi yo‘l uchun vaqt qoldiring."
					)
				: L(
						"Keep the stop readable: one clear arrival, one clear exit.",
						"Держите остановку читаемой: понятный вход и понятный выход.",
						"Bekatni o‘qiladigan tuting: aniq kirish va aniq chiqish."
					);

	return [
		{
			icon: "CircleQuestionMark",
			title: L(
				`How much time should ${n.en} get in the day plan?`,
				`Сколько времени закладывать на ${n.ru} в плане дня?`,
				`${n.uz} uchun kun rejasida qancha vaqt ajratish kerak?`
			),
			description: L(
				`${time.en} is a practical range for most groups. ${typeHint.en} ${s.en ? `Place tone: “${s.en}”.` : ""}`.trim(),
				`Для большинства групп реалистичный диапазон — ${time.ru}. ${typeHint.ru} ${s.ru ? `Характер места: «${s.ru}».` : ""}`.trim(),
				`Ko‘p guruhlar uchun amaliy diapazon — ${time.uz}. ${typeHint.uz} ${s.uz ? `Joy ohangi: «${s.uz}».` : ""}`.trim()
			)
		},
		{
			icon: pick(["Clock", "Sunrise", "Sun"], h, 2),
			title: L(
				`When is ${n.en} strongest during the day?`,
				`В какое время дня ${n.ru} раскрывается сильнее?`,
				`${n.uz} kunning qaysi vaqtida kuchliroq ochiladi?`
			),
			description: L(
				`Prefer ${when.en}. That usually improves comfort, photos, and how the stop feels in the sequence${city ? ` around ${city}` : ""}.`,
				`Лучше ${when.ru}. Так обычно выигрывают комфорт, кадры и ощущение остановки в последовательности${city ? ` рядом с ${city}` : ""}.`,
				`${when.uz} afzal. Bu odatda qulaylik, surat va bekatning ketma-ketlikdagi hisini yaxshilaydi${city ? ` (${city} atrofida)` : ""}.`
			)
		},
		{
			icon: pick(["MapPin", "Compass", "Landmark"], h, 3),
			title: L(
				`How should ${n.en} sit next to nearby stops?`,
				`Как поставить ${n.ru} рядом с соседними остановками?`,
				`${n.uz}ni yaqin bekatlar yonida qanday joylashtirish kerak?`
			),
			description: L(
				`Treat it as one clear pin on the map: arrive intentionally, avoid sandwiching it between two rushed monuments, and keep the next move short enough that the group still has energy.`,
				`Держите это как одну ясную точку на карте: приезжайте осознанно, не зажимайте между двумя спешными памятниками и оставляйте следующий ход достаточно коротким, чтобы у группы оставались силы.`,
				`Buni xaritada bitta aniq nuqta qiling: ongli keling, ikkita shoshilinch yodgorlik orasiga tiqmang va keyingi qadamni guruhda kuch qoladigan qilib qisqa tuting.`
			)
		}
	];
}

function faqHeader(layer, doc) {
	const n = nameOf(doc);
	if (layer === "countries") {
		return {
			eyebrow: L("Routes in detail", "Маршруты в деталях", "Marshrutlar batafsil"),
			title: L(
				"How route pace works in practice",
				"Как темп маршрута работает на практике",
				"Marshrut sur’ati amalda qanday ishlaydi"
			),
			description: L(
				`Use these notes to brief clients on transfers and overnight logic in ${n.en}.`,
				`Используйте эти заметки для брифа клиентов по переездам и логике ночёвок в ${n.ru}.`,
				`Ko‘chishlar va tunash mantig‘i bo‘yicha mijoz brifi uchun ushbu izohlardan foydalaning (${n.uz}).`
			)
		};
	}
	if (layer === "regions") {
		return {
			eyebrow: L("Region in detail", "Регион в деталях", "Hudud batafsil"),
			title: L(
				`Practical questions about ${n.en}`,
				`Практические вопросы о регионе ${n.ru}`,
				`${n.uz} hududi bo‘yicha amaliy savollar`
			),
			description: L(
				"Pace, season, and how this region connects to the next stop.",
				"Темп, сезон и как регион стыкуется со следующей остановкой.",
				"Sur’at, mavsum va hududning keyingi bekat bilan ulanishi."
			)
		};
	}
	if (layer === "cities") {
		return {
			eyebrow: L("City in detail", "Город в деталях", "Shahar batafsil"),
			title: L(
				`How to place ${n.en} in the day plan`,
				`Как поставить ${n.ru} в план дня`,
				`${n.uz}ni kun rejasiga qanday joylashtirish`
			),
			description: L(
				"Walking time, overnight location, and when day trips make sense.",
				"Пешее время, место ночёвки и когда выезды имеют смысл.",
				"Piyoda vaqt, tunash joyi va chiqishlar qachon o‘rinli."
			)
		};
	}
	return {
		eyebrow: L("Place in detail", "Место в деталях", "Joy batafsil"),
		title: L(
			`What agencies ask about ${n.en}`,
			`Что агентства спрашивают про ${n.ru}`,
			`Agentliklar ${n.uz} haqida nima so‘raydi`
		),
		description: L(
			"Timing, best hours, and how this stop fits neighbouring pins.",
			"Тайминг, лучшие часы и как остановка стыкуется с соседними точками.",
			"Tayming, eng yaxshi soatlar va bekatning yaqin nuqtalar bilan ulanishi."
		)
	};
}

function buildQuestions(layer, doc, slug, h) {
	if (layer === "countries") return buildCountryFaq(doc, slug, h);
	if (layer === "regions") return buildRegionFaq(doc, slug, h);
	if (layer === "cities") return buildCityFaq(doc, slug, h);
	return buildAttractionFaq(doc, slug, h);
}

function faqBlockYaml(layer, doc, slug) {
	const h = hashSlug(slug);
	const header = faqHeader(layer, doc);
	const questions = buildQuestions(layer, doc, slug, h);

	const cardsYaml = questions
		.map(
			(q) => `      - "type": "destinationInsight"
        "icon": ${JSON.stringify(q.icon)}
        "title":
${locBlock(q.title, 10)}
        "description":
${locBlock(q.description, 10)}`
		)
		.join("\n");

	return `  - "blockType": "regular"
    "eyebrow":
${locBlock(header.eyebrow, 6)}
    "title":
${locBlock(header.title, 6)}
    "description":
${locBlock(header.description, 6)}
    "gridClassName": "grid-cols-1"
    "cards":
${cardsYaml}
`;
}

function stripExistingFaq(source) {
	let next = source.replace(
		/\n  - "blockType": "faq"\n[\s\S]*?(?=\n  - "blockType": |\n"seo":)/g,
		"\n"
	);
	// Previous insight-card FAQ conversion (stacked destinationInsight)
	next = next.replace(
		/\n  - "blockType": "regular"\n    "eyebrow":\n(?:[^\n]*\n)*?    "gridClassName": "grid-cols-1"\n    "cards":\n(?:      - "type": "destinationInsight"\n[\s\S]*?)+?(?=\n  - "blockType": |\n"seo":)/g,
		"\n"
	);
	return next;
}

function insertFaq(source, faqYaml) {
	const ctaPattern = /\n  - "blockType": "cta"\n/;
	if (ctaPattern.test(source)) {
		return source.replace(ctaPattern, `\n${faqYaml}  - "blockType": "cta"\n`);
	}
	if (source.includes('\n"seo":')) {
		return source.replace(/\n"seo":/, `\n${faqYaml}"seo":`);
	}
	throw new Error("no cta/seo insert point");
}

let ok = 0;
let failed = 0;
const byLayer = {};

for (const layer of LAYERS) {
	const dir = path.join("content", layer);
	byLayer[layer] = { ok: 0, failed: 0 };
	for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".yml")).sort()) {
		const filePath = path.join(dir, file);
		let source = fs.readFileSync(filePath, "utf8");
		const doc = YAML.parse(source);
		const slug = resolveSlug(doc, file);

		try {
			source = stripExistingFaq(source);
			const faqYaml = faqBlockYaml(layer, doc, slug);
			source = insertFaq(source, faqYaml);
			fs.writeFileSync(filePath, source);
			ok++;
			byLayer[layer].ok++;
			console.log("faq", layer, file);
		} catch (error) {
			failed++;
			byLayer[layer].failed++;
			console.error("FAIL", layer, file, error.message);
		}
	}
}

console.log({ ok, failed, byLayer });
if (failed) process.exit(1);
