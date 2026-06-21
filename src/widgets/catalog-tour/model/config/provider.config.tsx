import { type LucideIcon, Mail, MapPin, Phone } from "lucide-react";

import type { ICatalogPreviewOperator } from "@/entities/tour/catalog";

export interface IProviderContact {
	value: string;
	icon: LucideIcon;
}

export const PROVIDER_CONTACTS = (
	providerData?: ICatalogPreviewOperator
): IProviderContact[] => [
	{
		icon: Phone,
		value: providerData?.phone ?? "--//--"
	},
	{
		icon: Mail,
		value: providerData?.email ?? "--//--"
	},
	{
		icon: MapPin,
		value: providerData?.address ?? "--//--"
	}
];
