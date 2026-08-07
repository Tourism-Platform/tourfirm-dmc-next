import { type LucideIcon, Mail, MapPin, Phone } from "lucide-react";

import type { IPreviewOperator } from "@/entities/tour/preview-tour";

export type TProviderContact = { value: string; icon: LucideIcon };

export const PROVIDER_CONTACTS = (
	provider?: IPreviewOperator
): TProviderContact[] => [
	{ icon: Phone, value: provider?.phone ?? "--//--" },
	{ icon: Mail, value: provider?.email ?? "--//--" },
	{ icon: MapPin, value: provider?.address ?? "--//--" }
];
