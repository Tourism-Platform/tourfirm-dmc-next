import { BlockType, type TBlockRenderProps } from "@/shared/ui/blocks";
import { ActionVariant } from "@/shared/ui/buttons";
import { CardType } from "@/shared/ui/cards";

import { TEAM_PREVIEW_MEDIA } from "./team-preview.media";

export const ALIZHON_MAMATKULOV_SECTIONS: TBlockRenderProps[] = [
	{
		blockType: BlockType.hero,
		imageSrc: TEAM_PREVIEW_MEDIA.hero,
		imageAlt: "Алижон Маматкулов",
		title: "Алижон Маматкулов",
		description: "«Для меня качество всегда важнее количества».",
		tags: ["Travel Expert", "Japanese Market"]
	},
	{
		blockType: BlockType.overviewStats,
		cards: [
			{
				type: CardType.OverviewStat,
				item: {
					icon: "calendar",
					label: "В туризме",
					value: "с 2025 года",
					hint: "В команде TourLink с 2026"
				}
			},
			{
				type: CardType.OverviewStat,
				item: {
					icon: "globe",
					label: "Рынок",
					value: "Японский",
					hint: "Индивидуальные, групповые и деловые программы"
				}
			},
			{
				type: CardType.OverviewStat,
				item: {
					icon: "languages",
					label: "Языки в работе",
					langs: ["JA", "EN"],
					hint: "Японский и английский"
				}
			},
			{
				type: CardType.OverviewStat,
				item: {
					icon: "graduation-cap",
					label: "Образование",
					value: "ТГУВ, японоведение",
					hint: "Высшая школа японоведения"
				}
			}
		]
	},
	{
		blockType: BlockType.regular,
		eyebrow: "О сотруднике",
		rows: [
			{
				ratio: "1:2",
				left: [
					{
						type: CardType.Portrait,
						item: {
							imageUrl: TEAM_PREVIEW_MEDIA.people,
							title: "Алижон Маматкулов"
						}
					}
				],
				right: [
					{
						type: CardType.Quote,
						item: {
							quoteHtml:
								"<p>Мой интерес к туризму появился ещё во время изучения японского языка: один из первых преподавателей много лет работал в этой сфере и <em>часто рассказывал на занятиях истории из своей практики</em>.</p>",
							caption:
								"Алижон Маматкулов, эксперт по путешествиям"
						}
					},
					{
						type: CardType.DashTitle,
						item: {
							description:
								"Я работаю в туризме с 2025 года, а в 2026 году присоединился к команде TourLink, где занимаюсь прежде всего японским направлением. Позже, благодаря советам преподавателей и старших коллег, я окончательно решил развиваться именно в туризме."
						}
					},
					{
						type: CardType.DashTitle,
						item: {
							title: "Образование и языки",
							description:
								"Я окончил Высшую школу японоведения Ташкентского государственного университета востоковедения. Также проходил обучение по английскому языку, сфере обслуживания в Японии и гостиничному сервису в рамках подготовки по программе Tokutei Ginou. В работе использую японский и английский языки."
						}
					},
					{
						type: CardType.DashTitle,
						item: {
							title: "Подход",
							description:
								"Работу с новым путешественником или партнёром я начинаю с того, чтобы понять, чего именно он ждёт от поездки: какой регион хочет увидеть, какие впечатления получить, что попробовать и чем заняться."
						}
					}
				]
			}
		]
	},
	{
		blockType: BlockType.timeline,
		tone: "tint",
		layout: "horizontal",
		eyebrow: "Чем я занимаюсь",
		title: "Маршрут под конкретного путешественника",
		description:
			"Особенно интересно создавать индивидуальные туры под конкретные пожелания, а также комбинированные маршруты по четырём странам региона.",
		tags: ["Узбекистан", "Кыргызстан", "Казахстан", "Туркменистан"],
		items: [
			{
				title: "Знакомство",
				description:
					"Какой регион хочется увидеть, какие впечатления получить, что попробовать и чем заняться."
			},
			{
				title: "Программа",
				description:
					"Индивидуальные и групповые путешествия: культурно-познавательные, гастрономические, активные и деловые."
			},
			{
				title: "Отели и логистика",
				description:
					"Бронирование отелей, транспорт и логистика. Отель — по расположению и уровню сервиса."
			},
			{
				title: "Связь 24/7",
				description:
					"Во время тура остаюсь на связи, отвечаю на вопросы и помогаю решать возникающие ситуации."
			}
		],
		criteria: {
			label: "При создании маршрута",
			title: "Что я держу в голове",
			description:
				"Если планы неожиданно меняются, для меня важно спокойно объяснить обстоятельства и найти решение, приемлемое для всех сторон.",
			tags: [
				"Пожелания гостя",
				"Бюджет",
				"Продолжительность",
				"Удобство",
				"Безопасность",
				"Комфортные трансферы",
				"Логичность программы"
			]
		}
	},
	{
		blockType: BlockType.regular,
		eyebrow: "Принцип",
		title: "Чем измеряется хорошая поездка",
		rows: [
			{
				left: [
					{
						type: CardType.Quote,
						item: {
							quoteHtml:
								"<p>Я хочу, чтобы каждый путешественник после поездки чувствовал, что <em>правильно выбрал компанию</em> для знакомства с Узбекистаном.</p>",
							caption: "Качество важнее количества",
							quoteVariant: "wide"
						}
					}
				]
			},
			{
				ratio: "3:2",
				left: [
					{
						type: CardType.DashTitle,
						item: {
							title: "Что важно в работе",
							description:
								"Мне близки внимание к деталям, ответственность, надёжность, гибкость и искреннее гостеприимство. Мне легко находить общий язык с людьми, поэтому я стараюсь быть доступным для гостей на протяжении всей поездки."
						}
					},
					{
						type: CardType.DashTitle,
						item: {
							description:
								"Одной из сильных сторон TourLink я считаю сочетание опыта старших специалистов и энергии молодого поколения: здесь знания передаются внутри команды, а молодым сотрудникам помогают принимать более взвешенные решения."
						}
					}
				],
				right: [
					{
						type: CardType.DashTitle,
						item: {
							title: "Что для меня результат",
							description:
								"Я буду рад помочь создать незабываемые воспоминания в Узбекистане и вместе с TourLink сопровождать вас в путешествии по стране, наполненной историей, гостеприимством и знаменитыми голубыми куполами."
						}
					},
					{
						type: CardType.ValuePoint,
						item: {
							title: "Ответственность и надёжность",
							description:
								"Гость знает, к кому обратиться в любой момент поездки."
						}
					},
					{
						type: CardType.ValuePoint,
						item: {
							title: "Гибкость",
							description:
								"Планы меняются — решение находится спокойно и для всех сторон."
						}
					},
					{
						type: CardType.ValuePoint,
						item: {
							title: "Искреннее гостеприимство",
							description:
								"Не сервисная формальность, а нормальное человеческое отношение."
						}
					}
				]
			}
		]
	},
	{
		blockType: BlockType.regular,
		tone: "tint",
		eyebrow: "Блиц",
		title: "Коротко о главном",
		gridClassName: "sm:grid-cols-2 lg:grid-cols-3",
		cards: [
			{
				type: CardType.BlitzQa,
				item: {
					title: "Любимое место",
					description: "Ташкент. Здесь прошли мои студенческие годы."
				}
			},
			{
				type: CardType.BlitzQa,
				item: {
					title: "Менее известный Узбекистан",
					description: "Бахмаль и Айдаркуль в Джизакской области.",
					featured: true
				}
			},
			{
				type: CardType.BlitzQa,
				item: {
					title: "Обязательно попробовать",
					description: "Самсу с томатным соусом."
				}
			},
			{
				type: CardType.BlitzQa,
				item: {
					title: "Ремёсла",
					description: "Работа мастеров резьбы в Самарканде и Бухаре."
				}
			},
			{
				type: CardType.BlitzQa,
				item: {
					title: "Вечер",
					description:
						"Фольклорное представление в медресе Нодир-Диван-Беги.",
					featured: true
				}
			},
			{
				type: CardType.BlitzQa,
				item: {
					title: "Если приехать весной",
					description: "Навруз и праздничные блюда."
				}
			}
		]
	},
	{
		blockType: BlockType.regular,
		eyebrow: "Советы",
		title: "Что я рекомендую увидеть",
		description:
			"Знакомство с Узбекистаном для меня невозможно без местной кухни и ремесленных традиций.",
		displayMode: "mosaic",
		cards: [
			{
				type: CardType.MosaicTile,
				item: {
					imageUrl: TEAM_PREVIEW_MEDIA.hero,
					badge: "Столица",
					title: "Старый и современный Ташкент",
					description:
						"Здесь прошли мои студенческие годы, и с этим городом связан важный период моего развития. Гостям особенно советую почувствовать разницу между двумя его атмосферами.",
					span: "large"
				}
			},
			{
				type: CardType.MosaicTile,
				item: {
					imageUrl: TEAM_PREVIEW_MEDIA.work,
					badge: "Джизакская область",
					title: "Бахмаль и Айдаркуль",
					description:
						"Тем, кто хочет увидеть менее известные уголки страны.",
					span: "wide"
				}
			},
			{
				type: CardType.MosaicTile,
				item: {
					imageUrl: TEAM_PREVIEW_MEDIA.samarkand,
					badge: "Кухня",
					title: "Самса с томатным соусом",
					description: "С этого стоит начать."
				}
			},
			{
				type: CardType.MosaicTile,
				item: {
					imageUrl: TEAM_PREVIEW_MEDIA.people,
					badge: "Ремёсла и вечер",
					title: "Резьба и фольклор",
					description:
						"Мастера Самарканда и Бухары, представление в Нодир-Диван-Беги."
				}
			}
		]
	},
	{
		blockType: BlockType.regular,
		tone: "warm",
		eyebrow: "Путешествия",
		title: "Смотрю на повседневную жизнь",
		description:
			"Больше всего люблю наблюдать за тем, как живут люди: гулять пешком по жилым кварталам, сравнивать образ жизни разных стран, замечать сходства и различия в культуре и привычках.",
		gridClassName: "sm:grid-cols-3",
		cards: [
			{
				type: CardType.ValuePoint,
				item: {
					icon: "footprints",
					title: "Пешком по кварталам",
					description:
						"Жилые улицы говорят о городе больше, чем главные площади."
				}
			},
			{
				type: CardType.ValuePoint,
				item: {
					icon: "scale",
					title: "Сравнивать",
					description:
						"Сходства и различия в культуре и привычках разных стран."
				}
			},
			{
				type: CardType.ValuePoint,
				item: {
					icon: "clock",
					title: "Токио",
					description:
						"Поездка, которая произвела самое сильное впечатление."
				}
			}
		]
	},
	{
		blockType: BlockType.cta,
		imageSrc: TEAM_PREVIEW_MEDIA.samarkand,
		eyebrow: "Запрос",
		title: "Добро пожаловать в Узбекистан",
		description:
			"Расскажите, какой регион хотите увидеть и какие впечатления получить, — соберу маршрут под ваши пожелания, бюджет и сроки.",
		actions: [
			{
				type: ActionVariant.link,
				item: {
					title: "Написать Алижону",
					href: "/help/contact",
					variant: "default"
				}
			},
			{
				type: ActionVariant.link,
				item: {
					title: "Смотреть туры",
					href: "/tours/catalog",
					variant: "outline"
				}
			}
		]
	}
];
