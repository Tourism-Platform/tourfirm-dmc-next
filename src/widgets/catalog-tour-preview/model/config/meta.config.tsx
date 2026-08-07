import { Globe, type LucideIcon, Map } from "lucide-react";

export interface IMetaInfo {
	icon: LucideIcon;
	label: string;
	value: string;
}

export const META_INFO = (
	citiesStr: string,
	languagesStr: string,
	citiesLabel: string,
	languagesLabel: string
): IMetaInfo[] => {
	const info: IMetaInfo[] = [];

	if (citiesStr) {
		info.push({
			icon: Map,
			label: citiesLabel,
			value: citiesStr
		});
	}

	if (languagesStr) {
		info.push({
			icon: Globe,
			label: languagesLabel,
			value: languagesStr
		});
	}

	return info;
};
