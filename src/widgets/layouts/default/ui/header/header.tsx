import type { TResolvedNavLink } from "@/shared/types/navigation.types";

import { HeaderShell } from "./header-shell";

type TProps = {
	navItems: TResolvedNavLink[];
	logoSrc?: string;
	logoAlt?: string;
};

export function HeaderDefault({ navItems, logoSrc, logoAlt }: TProps) {
	return (
		<HeaderShell navItems={navItems} logoSrc={logoSrc} logoAlt={logoAlt} />
	);
}
