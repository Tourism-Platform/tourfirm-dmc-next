import { Link } from "@/shared/i18n";

import { Button, type TButtonVariantsProps } from "../../shadcn-ui/button";

type TLinkButtonProps = {
	href: string;
	title: string;
	variant?: TButtonVariantsProps["variant"];
};

export function LinkButton({
	href,
	title,
	variant = "default"
}: TLinkButtonProps) {
	return (
		<Button asChild variant={variant}>
			<Link href={href}>{title}</Link>
		</Button>
	);
}
