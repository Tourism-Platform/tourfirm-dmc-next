import { ENUM_PATH } from "@/shared/config";

import type { IFooterSectionConfig } from "../types/footer-section.types";

export const FOOTER_SECTIONS: IFooterSectionConfig[] = [
	{
		title: "sections.company.title",
		links: [
			{
				label: "sections.company.links.about",
				path: ENUM_PATH.COMPANY.ABOUT
			},
			{
				label: "sections.company.links.services",
				path: ENUM_PATH.COMPANY.SERVICES
			},
			{
				label: "sections.company.links.partnership",
				path: ENUM_PATH.COMPANY.PARTNERSHIP,
				isSoon: true
			},
			{
				label: "sections.company.links.news",
				path: ENUM_PATH.COMPANY.NEWS,
				isSoon: true
			},
			{
				label: "sections.company.links.feedback",
				path: ENUM_PATH.COMPANY.FEEDBACK,
				isSoon: true
			}
		]
	},
	{
		title: "sections.toursPartners.title",
		links: [
			{
				label: "sections.toursPartners.links.destinations",
				path: ENUM_PATH.MAIN.DESTINATIONS
			},
			{
				label: "sections.toursPartners.links.tours",
				path: ENUM_PATH.MAIN.CATALOG
			},
			{
				label: "sections.toursPartners.links.agencies",
				path: ENUM_PATH.PARTNERS.AGENCIES,
				isSoon: true
			},
			{
				label: "sections.toursPartners.links.hotels",
				path: ENUM_PATH.PARTNERS.HOTELS
			}
		]
	},
	{
		title: "sections.policies.title",
		links: [
			{
				label: "sections.policies.links.terms",
				path: ENUM_PATH.LEGAL.TERMS
			},
			{
				label: "sections.policies.links.booking",
				path: ENUM_PATH.LEGAL.BOOKING
			},
			{
				label: "sections.policies.links.cancellation",
				path: ENUM_PATH.LEGAL.CANCELLATION
			},
			{
				label: "sections.policies.links.cookies",
				path: ENUM_PATH.LEGAL.COOKIES
			},
			{
				label: "sections.policies.links.privacy",
				path: ENUM_PATH.LEGAL.PRIVACY
			}
		]
	},
	{
		title: "sections.help.title",
		links: [
			{
				label: "sections.help.links.support",
				path: ENUM_PATH.HELP.SUPPORT,
				isSoon: true
			},
			{
				label: "sections.help.links.contact",
				path: ENUM_PATH.HELP.CONTACT
			},
			{
				label: "sections.help.links.faq",
				path: ENUM_PATH.HELP.FAQ,
				isSoon: true
			},
			{
				label: "sections.help.links.training",
				path: ENUM_PATH.HELP.TRAINING,
				isSoon: true
			},
			{
				label: "sections.help.links.moreInfo",
				path: ENUM_PATH.HELP.MORE_INFO,
				isSoon: true
			}
		]
	}
];
