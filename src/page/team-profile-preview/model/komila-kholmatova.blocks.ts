import { BlockType, type TBlockRenderProps } from "@/shared/ui/blocks";
import { ActionVariant } from "@/shared/ui/buttons";
import { CardType } from "@/shared/ui/cards";

export const KOMILA_KHOLMATOVA_SECTIONS: TBlockRenderProps[] = [
	{
		blockType: BlockType.hero,
		imageSrc: "/assets/images/people.jpg",
		imageAlt: "Комила Холматова",
		title: "Комила Холматова",
		description: "Эксперт по путешествиям · англоязычные рынки",
		note: "Travel Expert · English-speaking Markets"
	},
	{
		blockType: BlockType.regular,
		gridClassName: "sm:grid-cols-2 lg:grid-cols-4",
		cards: [
			{
				type: CardType.OverviewStat,
				item: { icon: "calendar", value: "В туризме с июня 2026" }
			},
			{
				type: CardType.OverviewStat,
				item: { icon: "globe", value: "Англоязычные рынки" }
			},
			{
				type: CardType.OverviewStat,
				item: {
					icon: "languages",
					value: "Английский, русский, турецкий"
				}
			},
			{
				type: CardType.OverviewStat,
				item: {
					icon: "book-open",
					value: "УзГУМЯ, английский язык, 2024"
				}
			}
		]
	},
	{
		blockType: BlockType.regular,
		eyebrow: "О сотруднике",
		title: "Комила Холматова",
		rows: [
			{
				ratio: "1:2",
				left: [
					{
						type: CardType.Portrait,
						item: {
							imageUrl: "/assets/images/people.jpg",
							title: "Комила Холматова"
						}
					}
				],
				right: [
					{
						type: CardType.Quote,
						item: {
							quoteHtml:
								"<p>Я пришла в туризм в июне 2026 года. Меня давно привлекала возможность работать с людьми из разных стран, общаться с ними, узнавать больше об их культуре и одновременно открывать для них Узбекистан.</p>"
						}
					},
					{
						type: CardType.DashTitle,
						item: {
							title: "Роль",
							description:
								"Эксперт по путешествиям. Англоязычные рынки. В 2024 году окончила Узбекский государственный университет мировых языков по направлению английского языка. Свободно владеет английским, говорит на русском и турецком."
						}
					},
					{
						type: CardType.DashTitle,
						item: {
							title: "Подход",
							description:
								"Путешествие начинается с человека: сначала интересы, бюджет, даты и цель поездки — и только потом маршрут. Если во время поездки что-то меняется, разбираюсь в причине, предупреждаю гостя и предлагаю удобную альтернативу."
						}
					}
				]
			},
			{
				left: [
					{
						type: CardType.DashTitle,
						item: {
							title: "Как я смотрю на страну",
							description:
								"Мне интересны природа, люди, история, культура и повседневная жизнь. Знакомство со страной я дополняю местной кухней, ремёслами и живыми встречами с жителями — не только главными маршрутами."
						}
					}
				]
			}
		]
	},
	{
		blockType: BlockType.regular,
		eyebrow: "Направления",
		title: "Чем я занимаюсь",
		description:
			"Составляю туристические программы, считаю стоимость, бронирую услуги, организую транспорт, встречи и проводы. При выборе отелей и ресторанов смотрю на чистоту, комфорт, расположение, качество и разумное соотношение цены и сервиса. Во время поездки объясняю маршрут и транспорт, правила безопасности, даю контакты и остаюсь на связи. При личной встрече хочу лёгкую и доброжелательную атмосферу — с живым общением и иногда с шутками и историями.",
		gridClassName: "sm:grid-cols-2",
		cards: [
			{
				type: CardType.DestinationInsight,
				item: {
					icon: "list-checks",
					title: "Программы",
					description:
						"Составление туристических программ, расчёты и бронирование услуг — от запроса до подтверждённой поездки."
				}
			},
			{
				type: CardType.DestinationInsight,
				item: {
					icon: "truck",
					title: "Транспорт и встречи",
					description:
						"Организация транспорта, встреча и проводы гостей."
				}
			},
			{
				type: CardType.DestinationInsight,
				item: {
					icon: "building-2",
					title: "Отели и рестораны",
					description:
						"Чистота, комфорт, расположение, качество и разумное соотношение цены и уровня сервиса."
				}
			},
			{
				type: CardType.DestinationInsight,
				item: {
					icon: "headset",
					title: "Забота в поездке",
					description:
						"Особенности маршрута, безопасность, контакты и связь. При встрече — лёгкая атмосфера, живое общение, хорошее настроение."
				}
			}
		]
	},
	{
		blockType: BlockType.regular,
		eyebrow: "Опыт",
		title: "Что стоит за организацией поездки",
		description:
			"После университета решила развиваться в туризме и присоединилась к TourLink. Сегодня работаю преимущественно с путешественниками и партнёрами из англоязычных стран. Мне нравится заранее продумывать детали: хорошо организованная поездка должна быть интересной, комфортной и безопасной.",
		rows: [
			{
				ratio: "3:2",
				left: [
					{
						type: CardType.MiniTable,
						item: {
							icon: "graduation-cap",
							title: "Образование и языки",
							rows: [
								{
									icon: "book-open",
									title: "УзГУМЯ",
									description: "Английский язык, 2024"
								},
								{
									icon: "languages",
									title: "Языки в работе",
									description:
										"Английский свободно; русский и турецкий"
								},
								{
									icon: "globe",
									title: "Основной рынок",
									description: "Англоязычные страны"
								}
							]
						}
					}
				],
				right: [
					{
						type: CardType.DashTitle,
						item: {
							title: "Как я работаю",
							description:
								"Сначала понять человека — интересы, бюджет, даты, цель поездки — и только потом предлагать маршрут. Детали продумываю заранее, чтобы поездка была интересной, комфортной и безопасной."
						}
					}
				]
			}
		]
	},
	{
		blockType: BlockType.regular,
		eyebrow: "Принцип",
		title: "Ответственность и гостеприимство",
		rows: [
			{
				ratio: "2:1",
				left: [
					{
						type: CardType.Quote,
						item: {
							quoteHtml:
								"<p>Я никогда не стала бы рекомендовать небезопасный транспорт или вариант, который явно не соответствует интересам и бюджету путешественника.</p>"
						}
					},
					{
						type: CardType.DashTitle,
						item: {
							title: "Главный принцип",
							description:
								"В работе для меня особенно важны ответственность, искренность и гостеприимство. Во время поездки гости должны чувствовать, что о них действительно заботятся."
						}
					}
				],
				right: [
					{
						type: CardType.DashTitle,
						item: {
							title: "Что для меня результат",
							description:
								"Хочу, чтобы гости возвращались домой не просто довольными услугами, а счастливыми, вдохновлёнными и с желанием однажды снова приехать в Узбекистан."
						}
					}
				]
			}
		]
	},
	{
		blockType: BlockType.regular,
		eyebrow: "Советы",
		title: "Что я рекомендую увидеть",
		description:
			"Одно из любимых мест — Сангардакский водопад в Сурхандарье: природа, атмосфера и возможность совместить пейзаж с активным отдыхом. С этим местом связаны тёплые семейные воспоминания — однажды мы приехали большой компанией родственников, разделились на команды и весь день играли вместе. Гостям я бы показала сам водопад, окружающую природу и канатную дорогу — особенно тем, кто любит немного адреналина. Тем, кто хочет менее известный Узбекистан, советую Ферганскую долину. Знакомство со страной обязательно дополняю кухней — пловом, самсой и другими национальными блюдами — и живыми впечатлениями: приготовление традиционного хлеба, ремёсла, встречи с местными жителями.",
		gridClassName: "sm:grid-cols-2",
		cards: [
			{
				type: CardType.DestinationInsight,
				item: {
					icon: "waves",
					title: "Сангардакский водопад",
					description:
						"Сурхандарья: природа, атмосфера и активный отдых. С этим местом связаны тёплые семейные воспоминания."
				}
			},
			{
				type: CardType.DestinationInsight,
				item: {
					icon: "cable",
					title: "Канатная дорога",
					description:
						"Рядом с Сангардаком — особенно для тех, кто любит немного адреналина."
				}
			},
			{
				type: CardType.DestinationInsight,
				item: {
					icon: "map-pin",
					title: "Ферганская долина",
					description:
						"Для тех, кто хочет увидеть менее известный Узбекистан."
				}
			},
			{
				type: CardType.DestinationInsight,
				item: {
					icon: "utensils-crossed",
					title: "Кухня и ремёсла",
					description:
						"Плов, самса, приготовление традиционного хлеба, ремёсла и встречи с местными жителями."
				}
			}
		]
	},
	{
		blockType: BlockType.regular,
		eyebrow: "После поездки",
		title: "Новые воспоминания и новые возможности",
		rows: [
			{
				ratio: "2:1",
				left: [
					{
						type: CardType.Quote,
						item: {
							quoteHtml:
								"<p>Каждое путешествие открывает дверь к новым воспоминаниям и новым возможностям.</p>"
						}
					}
				],
				right: [
					{
						type: CardType.DashTitle,
						item: {
							title: "После знакомства",
							description:
								"Буду рада помочь сделать поездку по Узбекистану интересной, комфортной и безопасной."
						}
					}
				]
			}
		]
	},
	{
		blockType: BlockType.cta,
		imageSrc: "/assets/images/people.jpg",
		eyebrow: "Запрос",
		title: "Спланировать поездку",
		description:
			"Напишите — соберём программу под ваши интересы, бюджет и даты. Поездка по Узбекистану может быть интересной, комфортной и безопасной.",
		actions: [
			{
				type: ActionVariant.link,
				item: {
					title: "Связаться с нами",
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
