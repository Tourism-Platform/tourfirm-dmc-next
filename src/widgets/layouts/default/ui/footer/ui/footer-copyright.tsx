import type { IFooterCopyrightProps } from "../model";

export const FooterCopyright = ({ text }: IFooterCopyrightProps) => (
	<p className="text-sm text-muted-foreground">{text}</p>
);
