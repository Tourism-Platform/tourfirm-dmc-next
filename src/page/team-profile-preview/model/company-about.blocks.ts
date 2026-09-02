import { BlockType, type TBlockRenderProps } from "@/shared/ui/blocks";
import { ActionVariant } from "@/shared/ui/buttons";
import { CardType, type TCardRenderProps } from "@/shared/ui/cards";

import { TEAM_PREVIEW_MEDIA } from "./team-preview.media";

const PHOTO = {
	alina: "/media/team/alina-bikbulatova.jpg",
	subin: "/media/team/kang-subin.jpg",
	yulduz: "/media/team/yulduz-safarova.jpg"
} as const;

function member(item: {
	title: string;
	href: string;
	badge: string;
	description?: string;
	imageUrl?: string;
	langs?: string[];
	featured?: boolean;
}): TCardRenderProps {
	return {
		type: CardType.TeamMember,
		item: {
			href: item.href,
			badge: item.badge,
			title: item.title,
			description: item.description,
			imageUrl: item.imageUrl,
			langs: item.langs,
			featured: item.featured
		}
	};
}

function valuePoint(
	title: string,
	description: string,
	icon: string,
	span?: "wide"
): TCardRenderProps {
	return {
		type: CardType.ValuePoint,
		item: { title, description, icon, span }
	};
}

function blitz(
	title: string,
	description: string,
	options?: { featured?: boolean; span?: "wide" }
): TCardRenderProps {
	return {
		type: CardType.BlitzQa,
		item: {
			title,
			description,
			featured: options?.featured,
			span: options?.span
		}
	};
}

function country(item: {
	title: string;
	href: string;
	imageUrl: string;
	badge: string;
	description: string;
	featured?: boolean;
}): TCardRenderProps {
	return {
		type: CardType.Country,
		item: {
			href: item.href,
			imageUrl: item.imageUrl,
			badge: item.badge,
			title: item.title,
			description: item.description,
			cities: [],
			featured: item.featured
		}
	};
}

function dash(title: string, description: string): TCardRenderProps {
	return {
		type: CardType.DashTitle,
		item: { title, description }
	};
}

export const COMPANY_ABOUT_SECTIONS: TBlockRenderProps[] = [
	{
		blockType: BlockType.hero,
		imageSrc: TEAM_PREVIEW_MEDIA.hero,
		imageAlt: "Пейзаж Центральной Азии",
		title: "Ваша связь с Центральной Азией",
		description:
			"Напрямую. Уникальные маршруты по Узбекистану, Кыргызстану, Казахстану и всему региону — от команды, которая знает его изнутри.",
		tags: [
			"Узбекистан",
			"Кыргызстан",
			"Казахстан",
			"Таджикистан",
			"Туркменистан"
		]
	},
	{
		blockType: BlockType.overviewStats,
		cards: [
			{
				type: CardType.OverviewStat,
				item: {
					icon: "map",
					label: "География",
					value: "5 стран",
					hint: "Узбекистан, Кыргызстан, Казахстан, Таджикистан, Туркменистан"
				}
			},
			{
				type: CardType.OverviewStat,
				item: {
					icon: "users",
					label: "Команда",
					value: "Люди на местах",
					hint: "Маршруты строят те, кто знает регион изнутри"
				}
			},
			{
				type: CardType.OverviewStat,
				item: {
					icon: "link-2",
					label: "Формат",
					value: "DMC и платформа",
					hint: "Операторы, агентства и путешественники — на одной связи"
				}
			},
			{
				type: CardType.OverviewStat,
				item: {
					icon: "shield-check",
					label: "Принцип",
					value: "Без агрегаторов",
					hint: "Не алгоритм: живая команда за каждой программой"
				}
			}
		]
	},
	{
		blockType: BlockType.regular,
		eyebrow: "Что такое TourLink",
		title: "Связь между Центральной Азией и миром",
		rows: [
			{
				ratio: "1:2",
				left: [
					{
						type: CardType.Portrait,
						item: {
							imageUrl: TEAM_PREVIEW_MEDIA.people,
							title: "Команда TourLink",
							description:
								"Люди, которые стоят за каждым маршрутом"
						}
					}
				],
				right: [
					{
						type: CardType.Quote,
						item: {
							quoteHtml:
								"<p>TourLink — это не стартап. Это команда, которая привела с собой всё, что знала, и <em>построила вокруг этого платформу</em>.</p>",
							caption: "Миссия команды"
						}
					},
					dash(
						"Экосистема региона",
						"Первая в регионе комплексная туристическая экосистема: туроператоры, агентства, поставщики и путешественники на одной платформе."
					),
					dash(
						"Миссия",
						"Соединять Центральную Азию с миром: путешественникам — прямой доступ к региону, индустрии — к глобальной аудитории."
					)
				]
			}
		]
	},
	{
		blockType: BlockType.regular,
		tone: "tint",
		eyebrow: "Ценности",
		title: "Как мы принимаем решения",
		description:
			"Семь принципов, по которым мы работаем с путешественниками, агентствами и партнёрами.",
		rows: [
			{
				ratio: "1:2",
				left: [
					{
						type: CardType.Quote,
						item: {
							quoteHtml:
								"<p>Если чего-то не знаем — говорим прямо. Если что-то пошло не так — <em>решаем первыми</em>.</p>",
							caption: "Как мы работаем"
						}
					}
				],
				right: [
					dash(
						"01 — Экспертиза изнутри",
						"Знаем регион не из интернета. Если чего-то не знаем — говорим прямо, а не выдумываем."
					),
					dash(
						"02 — Надёжность",
						"Делаем то, что обещаем. Если что-то пошло не так — решаем первыми, не дожидаясь жалобы."
					),
					dash(
						"03 — Прозрачность",
						"Без скрытых условий. Агенты видят комиссию, туристы — полную стоимость, партнёры — как принимаются решения."
					),
					dash(
						"04 — Скорость",
						"Ценим время всех участников. Запросы обрабатываем быстро, платформа не заставляет делать лишних шагов."
					),
					dash(
						"05 — Страсть к делу",
						"Любим путешествия и Центральную Азию. Это чувствуется в каждом туре и в каждом разговоре."
					),
					dash(
						"06 — Уважение к региону",
						"Рассказываем о Центральной Азии точно и с уважением — без клише и без торговли экзотикой."
					),
					dash(
						"07 — Партнёрство",
						"Агентства, операторы, отели, гиды и путешественники — партнёры, а не контрагенты."
					)
				]
			}
		]
	},
	{
		blockType: BlockType.regular,
		eyebrow: "Наша команда",
		title: "За маршрутом стоят люди",
		description:
			"Каждый запрос начинается с человека, который помогает уточнить язык общения, форму маршрута и следующий практический шаг.",
		gridClassName: "mx-auto max-w-2xl sm:grid-cols-2",
		cards: [
			member({
				title: "Содик Бегматов",
				href: "/company/team/sodik-begmatov",
				badge: "Founder",
				description: "Публичное продолжение работы Orient Star Group",
				featured: true
			}),
			member({
				title: "Мухаммад Амин Бегматов",
				href: "/company/team/muhammad-amin-begmatov",
				badge: "CEO",
				description: "От запроса до подтверждённой программы",
				featured: true
			})
		]
	},
	{
		blockType: BlockType.regular,
		gridClassName: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
		cards: [
			member({
				title: "Абдулазиз Мавлонов",
				href: "/company/team/abdulaziz-mavlonov",
				badge: "BDD"
			}),
			member({
				title: "Одина Караходжаева",
				href: "/company/team/odina-karahodzhayeva",
				badge: "Travel Expert",
				langs: ["RU"]
			}),
			member({
				title: "Эльдор Келдибеков",
				href: "/company/team/eldor-keldibekov",
				badge: "Sales & Operations",
				langs: ["ES"]
			}),
			member({
				title: "Алижон Маматкулов",
				href: "/company/team/alizhon-mamatkulov",
				badge: "Travel Expert",
				langs: ["JA", "EN"]
			}),
			member({
				title: "Нозима Бегматова",
				href: "/company/team/nozima-begmatova",
				badge: "Sales & Operations",
				langs: ["EN"]
			}),
			member({
				title: "Комила Холматова",
				href: "/company/team/komila-kholmatova",
				badge: "Travel Expert",
				langs: ["EN", "RU", "TR"]
			}),
			member({
				title: "Канг Субин",
				href: "/company/team/subin-kang",
				badge: "Travel Expert",
				imageUrl: PHOTO.subin,
				langs: ["EN", "KO", "ES"]
			}),
			member({
				title: "Юлдуз Сафарова",
				href: "/company/team/yulduz-safarova",
				badge: "Travel Expert",
				imageUrl: PHOTO.yulduz,
				langs: ["DE", "TR"]
			}),
			member({
				title: "Алина Бикбулатова",
				href: "/company/team/alina-bikbulatova",
				badge: "Travel Expert",
				imageUrl: PHOTO.alina,
				langs: ["IT"]
			}),
			member({
				title: "Сойибжон Исаматов",
				href: "/company/team/soyibjon-isamatov",
				badge: "Travel Expert",
				langs: ["JA"]
			}),
			member({
				title: "Мадина Иргашева",
				href: "/company/team/madina-irgasheva",
				badge: "Sales & Operations",
				langs: ["FR"]
			})
		]
	},
	{
		blockType: BlockType.timeline,
		tone: "tint",
		layout: "horizontal",
		eyebrow: "Этапы развития",
		title: "Как растёт платформа TourLink",
		items: [
			{
				title: "Фаза 1 — сейчас",
				description:
					"Туроператоры, агентства и путешественники. Готовые туры и кастомные программы. Агенты видят комиссию и запрашивают индивидуальные маршруты."
			},
			{
				title: "Фаза 2 — следующий шаг",
				description:
					"Отели, транспорт, рестораны и другие поставщики. Сборка индивидуального тура из отдельных услуг."
			},
			{
				title: "Фаза 3 — экосистема",
				description:
					"Маркетплейс, B2B для агентств, аналитика, инструменты для гидов и интеграции с международными системами бронирования."
			}
		]
	},
	{
		blockType: BlockType.regular,
		eyebrow: "География",
		title: "Где работает TourLink",
		description:
			"В перспективе — расширение на сопредельные направления Шёлкового пути, при сохранении фокуса на Центральной Азии.",
		gridClassName: "sm:grid-cols-2 sm:gap-5 lg:gap-6",
		cards: [
			country({
				title: "Узбекистан",
				href: "/destinations/uzbekistan",
				imageUrl: "/assets/images/destinations/uzbekistan.jpg",
				badge: "Сердце Великого шёлкового пути",
				description:
					"Дом TourLink: дворы, ритм базара и города Шёлкового пути в одном маршруте.",
				featured: true
			}),
			country({
				title: "Казахстан",
				href: "/destinations/kazakhstan",
				imageUrl: "/assets/images/destinations/kazakhstan.jpg",
				badge: "Степной масштаб, горные города",
				description:
					"От широких проспектов Астаны к предгорьям Алматы и дворам Туркестана."
			}),
			country({
				title: "Кыргызстан",
				href: "/destinations/kyrgyzstan",
				imageUrl: "/assets/images/destinations/kyrgyzstan.jpg",
				badge: "Горы, озёра и дороги кочевников",
				description:
					"Иссык-Куль, ущелья Тянь-Шаня и маршруты, где ещё жива кочевая логика."
			}),
			country({
				title: "Таджикистан",
				href: "/destinations/tajikistan",
				imageUrl: "/assets/images/destinations/tajikistan.jpg",
				badge: "Там, где Памир касается неба",
				description:
					"Высокие перевалы, Фанские горы и дороги, которые требуют спокойного темпа."
			}),
			country({
				title: "Туркменистан",
				href: "/destinations/turkmenistan",
				imageUrl: "/assets/images/destinations/turkmenistan.jpg",
				badge: "Мраморная столица и пустынные дороги",
				description:
					"Ашхабад, оазисные руины и караванные линии через Каракумы."
			})
		],
		actions: [
			{
				type: ActionVariant.link,
				item: {
					title: "Смотреть направления",
					href: "/destinations",
					variant: "outline"
				}
			}
		]
	},
	{
		blockType: BlockType.regular,
		eyebrow: "Концепт бренда",
		title: "Связь — в основе всего",
		description:
			"TourLink соединяет стороны, которые без нас встретились бы с трудом — в географии, опыте, бизнесе и технологиях.",
		gridClassName: "sm:grid-cols-2 lg:grid-cols-3",
		cards: [
			valuePoint(
				"Путешественник",
				"Со всего мира — с Центральной Азией.",
				"globe"
			),
			valuePoint(
				"Турист",
				"С реальным регионом, а не с туристической витриной.",
				"map"
			),
			valuePoint(
				"Агентство",
				"С надёжным DMC-партнёром в регионе.",
				"handshake"
			),
			valuePoint(
				"Оператор",
				"Местный оператор — с глобальной аудиторией.",
				"radio"
			),
			valuePoint(
				"Экспертиза",
				"Накопленный опыт — с современными технологиями.",
				"sparkles",
				"wide"
			)
		]
	},
	{
		blockType: BlockType.regular,
		tone: "warm",
		eyebrow: "Границы бренда",
		title: "Чем мы не являемся",
		description:
			"Определить себя проще через то, чем ты не являешься. За каждым туром стоит живая команда — не алгоритм и не конвейер.",
		gridClassName: "sm:grid-cols-2 lg:grid-cols-3",
		cards: [
			blitz(
				"Не Booking",
				"Не витрина чужих отелей и не поиск по самой низкой цене."
			),
			blitz(
				"Не Expedia",
				"Не алгоритм, который продаёт регион готовым пакетом."
			),
			blitz(
				"Не агрегатор",
				"Не сводим чужие туры в ленту. Маршруты собираем сами.",
				{ featured: true }
			),
			blitz(
				"Не фабрика туров",
				"Не конвейер одинаковых программ «под всех»."
			),
			blitz(
				"Не посредник",
				"Без скрытых условий. Прозрачные договорённости и живой контакт."
			),
			blitz(
				"Не корпорация без лица",
				"Команда, к которой можно обратиться по имени."
			),
			blitz(
				"Не «новое направление»",
				"Регион, который знаем изнутри, — не рынок, который «открываем».",
				{ span: "wide" }
			)
		]
	},
	{
		blockType: BlockType.cta,
		imageSrc: TEAM_PREVIEW_MEDIA.hero,
		eyebrow: "Ваша связь с регионом",
		title: "Готовы открыть Центральную Азию?",
		description:
			"Посмотрите готовые маршруты или напишите нам — соединим вас с командой, которая знает регион изнутри.",
		actions: [
			{
				type: ActionVariant.link,
				item: {
					title: "Смотреть туры",
					href: "/tours/catalog",
					variant: "default"
				}
			},
			{
				type: ActionVariant.link,
				item: {
					title: "Связаться с нами",
					href: "/help/contact",
					variant: "outline"
				}
			}
		]
	}
];
