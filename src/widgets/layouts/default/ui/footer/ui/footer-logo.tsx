import Image from "next/image";

import type { IFooterLogoProps } from "../model";

const LOGO_SRC = "/assets/images/logo.svg";

export const FooterLogo = ({ brandName, tagline }: IFooterLogoProps) => {
	return (
		<div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
			<div className="flex shrink-0 items-center gap-3">
				<Image
					src={LOGO_SRC}
					alt={brandName}
					width={72}
					height={72}
					className="h-16 w-auto sm:h-[4.5rem]"
				/>
				<h3 className="text-3xl font-semibold tracking-tight sm:text-4xl">
					<span className="text-foreground">Tour</span>
					<span className="text-[#37bffa]">Link</span>
				</h3>
			</div>
			{tagline ? (
				<p className="max-w-xl font-[family-name:var(--font-kurier)] text-2xl italic leading-snug text-foreground sm:text-right sm:text-3xl">
					{tagline}
				</p>
			) : null}
		</div>
	);
};
