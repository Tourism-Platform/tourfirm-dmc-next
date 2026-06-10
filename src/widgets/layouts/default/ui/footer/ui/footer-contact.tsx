import { Mail, MapPin, Phone } from "lucide-react";

import { ENV } from "@/shared/config";

type TContactItem = {
	icon: typeof MapPin;
	value: string;
	href?: string;
};

const CONTACT_ITEMS: TContactItem[] = [
	{ icon: MapPin, value: ENV.CONTACT_ADDRESS },
	{
		icon: Phone,
		value: ENV.CONTACT_PHONE,
		href: `tel:${ENV.CONTACT_PHONE.replace(/\s/g, "")}`
	},
	{
		icon: Mail,
		value: ENV.CONTACT_EMAIL,
		href: `mailto:${ENV.CONTACT_EMAIL}`
	}
].filter((item) => item.value);

export const FooterContact = () => (
	<ul className="flex flex-col gap-2">
		{CONTACT_ITEMS.map(({ icon: Icon, value, href }) => (
			<li
				key={value}
				className="flex items-center gap-2 text-sm text-muted-foreground"
			>
				<Icon className="size-4 shrink-0" />
				{href ? (
					<a
						href={href}
						className="hover:text-foreground transition-colors"
					>
						{value}
					</a>
				) : (
					<span>{value}</span>
				)}
			</li>
		))}
	</ul>
);
