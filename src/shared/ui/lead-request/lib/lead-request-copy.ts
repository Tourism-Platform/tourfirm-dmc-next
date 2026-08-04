import { routing } from "@/shared/i18n";

export type TLeadRequestType =
	| "tour"
	| "route"
	| "business"
	| "partnership"
	| "other";

export type TLeadRequestFormValues = {
	name: string;
	email: string;
	phone: string;
	requestType: TLeadRequestType;
	message: string;
	consent: boolean;
};

export type TLeadRequestCopy = {
	dialogTitle: string;
	dialogDescription: string;
	name: string;
	email: string;
	phone: string;
	requestType: string;
	message: string;
	messagePlaceholder: string;
	consent: string;
	submit: string;
	requestTypes: Record<TLeadRequestType, string>;
};

const LOCALE_CONTACT_EMAIL = {
	ru: "russian@tourlink.ru",
	en: "english@tourlink.ru",
	uz: "english@tourlink.ru"
} as const;

const COPY: Record<string, TLeadRequestCopy> = {
	en: {
		dialogTitle: "Send a request",
		dialogDescription:
			"The form works for route ideas, tour requests, business trips, partnership questions, and practical help.",
		name: "Name",
		email: "Email",
		phone: "Phone or messenger",
		requestType: "Request type",
		message: "Message",
		messagePlaceholder:
			"Tell us about countries, dates, group size, pace, and important preferences.",
		consent:
			"I agree that TourLink uses this data to reply to the request and prepare travel services.",
		submit: "Send request",
		requestTypes: {
			tour: "Tour request",
			route: "Route idea",
			business: "Business trip",
			partnership: "Partnership",
			other: "Other"
		}
	},
	ru: {
		dialogTitle: "Отправить запрос",
		dialogDescription:
			"Форма подходит для идей маршрута, заявок на тур, деловых поездок, партнерских вопросов и практической помощи.",
		name: "Имя",
		email: "Email",
		phone: "Телефон или мессенджер",
		requestType: "Тип запроса",
		message: "Сообщение",
		messagePlaceholder:
			"Расскажите о странах, датах, размере группы, темпе поездки и важных пожеланиях.",
		consent:
			"Я согласен, что TourLink использует эти данные, чтобы ответить на запрос и подготовить туристические услуги.",
		submit: "Отправить запрос",
		requestTypes: {
			tour: "Заявка на тур",
			route: "Идея маршрута",
			business: "Деловая поездка",
			partnership: "Партнёрство",
			other: "Другое"
		}
	},
	uz: {
		dialogTitle: "So‘rov yuborish",
		dialogDescription:
			"Forma marshrut g‘oyalari, tur arizalari, ish safarlari, hamkorlik savollari va amaliy yordam uchun mos.",
		name: "Ism",
		email: "Email",
		phone: "Telefon yoki messenger",
		requestType: "So‘rov turi",
		message: "Xabar",
		messagePlaceholder:
			"Mamlakatlar, sanalar, guruh hajmi, sur’at va muhim istaklar haqida yozing.",
		consent:
			"TourLink ushbu ma’lumotlardan so‘rovga javob berish va turistik xizmatlarni tayyorlash uchun foydalanishiga roziman.",
		submit: "So‘rov yuborish",
		requestTypes: {
			tour: "Tur arizasi",
			route: "Marshrut g‘oyasi",
			business: "Ish safari",
			partnership: "Hamkorlik",
			other: "Boshqa"
		}
	}
};

export function getLeadRequestCopy(locale: string): TLeadRequestCopy {
	return COPY[locale] ?? COPY.en;
}

function resolveContactEmail(locale: string): string {
	if (locale in LOCALE_CONTACT_EMAIL) {
		return LOCALE_CONTACT_EMAIL[
			locale as keyof typeof LOCALE_CONTACT_EMAIL
		];
	}

	return LOCALE_CONTACT_EMAIL[
		routing.defaultLocale as keyof typeof LOCALE_CONTACT_EMAIL
	];
}

export function buildLeadRequestMailto(
	locale: string,
	values: TLeadRequestFormValues
): string {
	const copy = getLeadRequestCopy(locale);
	const email = resolveContactEmail(locale);
	const subject = encodeURIComponent(
		`${copy.dialogTitle}: ${copy.requestTypes[values.requestType]}`
	);
	const body = encodeURIComponent(
		[
			`${copy.name}: ${values.name}`,
			`${copy.email}: ${values.email}`,
			`${copy.phone}: ${values.phone}`,
			`${copy.requestType}: ${copy.requestTypes[values.requestType]}`,
			"",
			values.message
		].join("\n")
	);

	return `mailto:${email}?subject=${subject}&body=${body}`;
}
