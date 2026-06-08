import type { IFooterCopyrightProps } from "../model";

export const FooterCopyright = ({ text }: IFooterCopyrightProps) => (
	<p className="text-sm text-background/70">{text}</p>
);
