import Image from "next/image";

import type { IFooterLogoProps } from "../model";

const LOGO_SRC = "/asssets/logo.svg";

export const FooterLogo = ({ brandName }: IFooterLogoProps) => {
	return (
		<div className="flex items-center gap-2">
			<Image
				src={LOGO_SRC}
				alt={brandName}
				width={48}
				height={48}
				className="h-10 w-auto"
			/>
			<h3 className="text-2xl font-semibold">
				<span className="text-white">Tour</span>
				<span className="text-[#36bffa]">Link</span>
			</h3>
		</div>
	);
};
