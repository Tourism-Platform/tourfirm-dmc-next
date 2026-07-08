import { cn } from "@/shared/lib/utils";

import { buttonVariants } from "../../shadcn-ui";
import { type TButtonVariantsProps } from "../../shadcn-ui/button";

type TButtonMailtoProps = {
	email: string;
	title: string;
	variant?: TButtonVariantsProps["variant"];
	className?: string;
};

export function ButtonMailto({
	email,
	title,
	variant = "default",
	className
}: TButtonMailtoProps) {
	return (
		<a
			href={`mailto:${email}`}
			className={cn(buttonVariants({ variant }), className)}
		>
			{title}
		</a>
	);
}
