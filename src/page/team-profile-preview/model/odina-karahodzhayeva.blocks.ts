import { BlockType, type TBlockRenderProps } from "@/shared/ui/blocks";
import { ActionVariant } from "@/shared/ui/buttons";
import { CardType } from "@/shared/ui/cards";

export const ODINA_KARAHODZHAYEVA_SECTIONS: TBlockRenderProps[] = [
	{
		blockType: BlockType.hero,
		imageSrc: "/assets/images/people.jpg",
		imageAlt: "Одина Караходжаева",
		title: "Одина Караходжаева",
		description: "Эксперт по путешествиям · рынок СНГ",
		note: "Travel Expert · CIS Market"
	},
	{
		blockType: BlockType.regular,
		gridClassName: "sm:grid-cols-2 lg:grid-cols-4",
		cards: [
			{
				type: CardType.OverviewStat,
				item: { icon: "calendar", value: "С 2019 года в туризме" }
			},
			{
				type: CardType.OverviewStat,
				item: { icon: "globe", value: "Рынок СНГ" }
			},
			{
				type: CardType.OverviewStat,
				item: { icon: "briefcase", value: "MICE и VIP" }
			},
			{
				type: CardType.OverviewStat,
				item: { icon: "truck", value: "Транспорт и логистика" }
			}
		]
	},
	{
		blockType: BlockType.regular,
		eyebrow: "О сотруднике",
		title: "Одина Караходжаева",
		rows: [
			{
				ratio: "1:2",
				left: [
					{
						type: CardType.Portrait,
						item: {
							imageUrl: "/media/craft.jpg",
							title: "Одина Караходжаева"
						}
					}
				],
				right: [
					{
						type: CardType.Quote,
						item: {
							quoteHtml:
								"<p>Я работаю в туризме с 2019 года. В эту сферу меня привела любовь к своей стране и желание показать как можно большему числу людей, насколько красивым, гостеприимным и разным может быть Узбекистан.</p>"
						}
					},
					{
						type: CardType.DashTitle,
						item: {
							title: "Роль",
							description:
								"Эксперт по путешествиям. Рынок СНГ — индивидуальные и групповые программы, MICE и VIP."
						}
					},
					{
						type: CardType.DashTitle,
						item: {
							title: "Подход",
							description:
								"Особенно люблю туры и мероприятия, где нужно одновременно держать много деталей и работать с большим числом людей. Ищу решение даже для сложных запросов и остаюсь готовой к неожиданным изменениям."
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
								"Мне хочется, чтобы гости увидели не только знаменитые достопримечательности, но и почувствовали атмосферу страны, её людей, традиции и настоящее гостеприимство."
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
			"Я занимаюсь индивидуальными и групповыми турами, культурными, гастрономическими и активными программами, MICE и VIP-поездками, бронированием отелей, транспортом, логистикой и сопровождением гостей. Для меня важно сначала понять самого человека: его интересы, пожелания, бюджет и представление о комфорте, а уже затем создавать программу путешествия.",
		gridClassName: "sm:grid-cols-2",
		cards: [
			{
				type: CardType.DestinationInsight,
				item: {
					icon: "users",
					title: "Туры",
					description:
						"Индивидуальные и групповые туры: культурные, гастрономические и активные программы."
				}
			},
			{
				type: CardType.DestinationInsight,
				item: {
					icon: "sparkles",
					title: "MICE и VIP",
					description:
						"Мероприятия и VIP-поездки, где важно координировать подрядчиков и комфорт большого числа гостей."
				}
			},
			{
				type: CardType.DestinationInsight,
				item: {
					icon: "building-2",
					title: "Отели и сопровождение",
					description:
						"Бронирование отелей и сопровождение гостей на всём протяжении поездки."
				}
			},
			{
				type: CardType.DestinationInsight,
				item: {
					icon: "truck",
					title: "Транспорт и логистика",
					description:
						"Транспорт, логистика и практический опыт работы с экспедированием."
				}
			}
		]
	},
	{
		blockType: BlockType.regular,
		eyebrow: "Опыт",
		title: "Что стоит за организацией поездки",
		description:
			"У меня высшее образование в области бухгалтерского учёта и аудита, а также дополнительная профессиональная подготовка в сфере транспорта и логистики. Я имею сертификат экспедитора и практический опыт работы с транспортными и логистическими процессами. Значительная часть моего профессионального опыта связана с организацией мероприятий и торжеств — поэтому я хорошо умею координировать большое количество деталей, работать с разными подрядчиками и создавать комфортные условия для большого числа гостей. Сегодня этот опыт помогает мне особенно внимательно подходить к организации путешествий, мероприятий и сложных туристических программ.",
		rows: [
			{
				ratio: "3:2",
				left: [
					{
						type: CardType.MiniTable,
						item: {
							icon: "graduation-cap",
							title: "Образование и практика",
							rows: [
								{
									icon: "calculator",
									title: "Бухгалтерский учёт и аудит",
									description: "Высшее образование"
								},
								{
									icon: "package",
									title: "Транспорт и логистика",
									description:
										"Дополнительная подготовка и сертификат экспедитора"
								},
								{
									icon: "calendar-heart",
									title: "Организация мероприятий",
									description:
										"Координация деталей, подрядчиков и комфортных условий для большого числа гостей"
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
								"Сначала понять человека: интересы, пожелания, бюджет и представление о комфорте — и только затем собирать программу. Даже для сложных запросов и неожиданных изменений."
						}
					}
				]
			}
		]
	},
	{
		blockType: BlockType.regular,
		eyebrow: "Принцип",
		title: "Гости, а не просто туристы",
		description:
			"Главный принцип моей работы — честность. Для меня путешественники — не просто туристы, а прежде всего наши гости. Мне близка узбекская фраза: «Mehmon — otangday ulug‘». Именно поэтому комфорт, безопасность, внимание к деталям и забота о человеке для меня всегда остаются на первом месте. Даже после окончания тура мне бывает трудно прощаться с гостями, и со многими из них я продолжаю поддерживать связь.",
		rows: [
			{
				ratio: "2:1",
				left: [
					{
						type: CardType.DashTitle,
						item: {
							title: "Честность",
							description:
								"Комфорт, безопасность, внимание к деталям и забота о человеке всегда остаются на первом месте. Даже после тура бывает трудно прощаться — со многими гостями я продолжаю поддерживать связь."
						}
					}
				],
				right: [
					{
						type: CardType.Quote,
						item: {
							quoteHtml: "<p>Mehmon — otangday ulug‘</p>"
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
			"В Узбекистане мне сложно выбрать только одно любимое место — каждый город и каждый регион красив по-своему. Но тем, кто хочет увидеть что-то менее известное, я советую обратить внимание на Шахимардан. А знакомство с нашей страной невозможно представить без узбекской кухни — прежде всего плова и самсы. Мне хочется, чтобы гости увидели не только знаменитые достопримечательности, но и почувствовали атмосферу страны, её людей, традиции и настоящее гостеприимство.",
		gridClassName: "sm:grid-cols-2",
		cards: [
			{
				type: CardType.DestinationInsight,
				item: {
					icon: "map-pin",
					title: "Шахимардан",
					description:
						"Тем, кто хочет увидеть что-то менее известное, я советую обратить внимание на Шахимардан."
				}
			},
			{
				type: CardType.DestinationInsight,
				item: {
					icon: "utensils-crossed",
					title: "Плов и самса",
					description:
						"Знакомство со страной невозможно представить без узбекской кухни — прежде всего плова и самсы."
				}
			}
		]
	},
	{
		blockType: BlockType.regular,
		eyebrow: "После поездки",
		title: "Чтобы захотелось вернуться",
		rows: [
			{
				ratio: "2:1",
				left: [
					{
						type: CardType.Quote,
						item: {
							quoteHtml:
								"<p>Если после путешествия по Узбекистану вам захочется вернуться сюда ещё раз, значит, мы сделали свою работу правильно. Я хочу создавать поездки, которые остаются в памяти надолго и после которых Узбекистан становится местом, куда хочется возвращаться снова и снова.</p>"
						}
					}
				],
				right: [
					{
						type: CardType.DashTitle,
						item: {
							title: "Связь после тура",
							description:
								"Даже после окончания тура бывает трудно прощаться с гостями — со многими из них я продолжаю поддерживать связь."
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
			"Напишите — соберём программу под интересы, бюджет и комфорт.",
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
