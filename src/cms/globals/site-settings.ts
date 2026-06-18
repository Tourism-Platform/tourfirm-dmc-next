import type { GlobalConfig } from "payload";

export const SiteSettings: GlobalConfig = {
	slug: "site-settings",
	fields: [
		{
			name: "contact",
			type: "group",
			fields: [
				{
					name: "phoneDisplay",
					type: "text"
				},
				{
					name: "phoneE164",
					type: "text"
				},
				{
					name: "whatsappHref",
					type: "text"
				},
				{
					name: "defaultEmail",
					type: "text"
				},
				{
					name: "telegramNote",
					type: "text",
					localized: true
				}
			]
		},
		{
			name: "legal",
			type: "group",
			fields: [
				{
					name: "legalName",
					type: "text"
				},
				{
					name: "brandName",
					type: "text"
				},
				{
					name: "inn",
					type: "text"
				},
				{
					name: "oked",
					type: "text"
				},
				{
					name: "director",
					type: "text",
					localized: true
				},
				{
					name: "city",
					type: "text",
					localized: true
				},
				{
					name: "country",
					type: "text",
					localized: true
				},
				{
					name: "timezone",
					type: "text"
				},
				{
					name: "taxStatus",
					type: "text",
					localized: true
				}
			]
		}
	]
};
