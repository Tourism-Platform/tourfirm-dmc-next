import { Link } from "@/shared/i18n";
import { cn } from "@/shared/lib/utils";

import { buttonVariants } from "../../shadcn-ui";
import { type TButtonVariantsProps } from "../../shadcn-ui/button";

type TButtonLinkProps = {
	href: string;
	title: string;
	variant?: TButtonVariantsProps["variant"];
	className?: string;
};

export function ButtonLink({
	href,
	title,
	variant = "default",
	className
}: TButtonLinkProps) {
	return (
		<Link
			href={href}
			className={cn(buttonVariants({ variant }), className)}
		>
			{title}
		</Link>
	);
}
