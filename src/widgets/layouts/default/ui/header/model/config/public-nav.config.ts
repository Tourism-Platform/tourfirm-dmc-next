import {
	Briefcase,
	Building2,
	GraduationCap,
	Handshake,
	HelpCircle,
	Hotel,
	LifeBuoy,
	Mail,
	Megaphone,
	MessageSquare,
	Newspaper,
	Scale,
	Shield,
	Sparkles
} from "lucide-react";

import { ENUM_PATH } from "@/shared/config";

import type { IPublicNavLink } from "../types";

export const PUBLIC_NAV_ITEMS: IPublicNavLink[] = [
	{
		label: "public.nav.destinations.label",
		path: ENUM_PATH.MAIN.DESTINATIONS,
		sections: []
	},
	{
		label: "public.nav.tours.label",
		path: ENUM_PATH.MAIN.CATALOG,
		sections: []
	},
	{
		label: "public.nav.partners.label",
		sections: [
			{
				items: [
					{
						label: "public.nav.partners.items.agencies.label",
						description:
							"public.nav.partners.items.agencies.description",
						icon: Handshake,
						path: ENUM_PATH.PARTNERS.AGENCIES,
						isSoon: true
					},
					{
						label: "public.nav.partners.items.hotels.label",
						description:
							"public.nav.partners.items.hotels.description",
						icon: Hotel,
						path: ENUM_PATH.PARTNERS.HOTELS
					}
				]
			}
		]
	},
	{
		label: "public.nav.company.label",
		sections: [
			{
				items: [
					{
						label: "public.nav.company.items.about.label",
						description:
							"public.nav.company.items.about.description",
						icon: Sparkles,
						path: ENUM_PATH.COMPANY.ABOUT
					},
					{
						label: "public.nav.company.items.services.label",
						description:
							"public.nav.company.items.services.description",
						icon: Briefcase,
						path: ENUM_PATH.COMPANY.SERVICES
					},
					{
						label: "public.nav.company.items.partnership.label",
						description:
							"public.nav.company.items.partnership.description",
						icon: Building2,
						path: ENUM_PATH.COMPANY.PARTNERSHIP,
						isSoon: true
					},
					{
						label: "public.nav.company.items.news.label",
						description:
							"public.nav.company.items.news.description",
						icon: Newspaper,
						path: ENUM_PATH.COMPANY.NEWS,
						isSoon: true
					},
					{
						label: "public.nav.company.items.feedback.label",
						description:
							"public.nav.company.items.feedback.description",
						icon: MessageSquare,
						path: ENUM_PATH.COMPANY.FEEDBACK,
						isSoon: true
					}
				]
			}
		]
	},
	{
		label: "public.nav.policies.label",
		sections: [
			{
				items: [
					{
						label: "public.nav.policies.items.terms.label",
						description:
							"public.nav.policies.items.terms.description",
						icon: Scale,
						path: ENUM_PATH.LEGAL.TERMS,
						isSoon: true
					},
					{
						label: "public.nav.policies.items.privacy.label",
						description:
							"public.nav.policies.items.privacy.description",
						icon: Shield,
						path: ENUM_PATH.LEGAL.PRIVACY,
						isSoon: true
					}
				]
			}
		]
	},
	{
		label: "public.nav.help.label",
		sections: [
			{
				items: [
					{
						label: "public.nav.help.items.support.label",
						description:
							"public.nav.help.items.support.description",
						icon: LifeBuoy,
						path: ENUM_PATH.HELP.SUPPORT,
						isSoon: true
					},
					{
						label: "public.nav.help.items.contact.label",
						description:
							"public.nav.help.items.contact.description",
						icon: Mail,
						path: ENUM_PATH.HELP.CONTACT
					},
					{
						label: "public.nav.help.items.faq.label",
						description: "public.nav.help.items.faq.description",
						icon: HelpCircle,
						path: ENUM_PATH.HELP.FAQ,
						isSoon: true
					},
					{
						label: "public.nav.help.items.training.label",
						description:
							"public.nav.help.items.training.description",
						icon: GraduationCap,
						path: ENUM_PATH.HELP.TRAINING,
						isSoon: true
					},
					{
						label: "public.nav.help.items.moreInfo.label",
						description:
							"public.nav.help.items.moreInfo.description",
						icon: Megaphone,
						path: ENUM_PATH.HELP.MORE_INFO,
						isSoon: true
					}
				]
			}
		]
	}
];
