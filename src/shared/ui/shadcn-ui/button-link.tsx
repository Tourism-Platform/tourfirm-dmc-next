import type { ComponentProps } from "react";

import { Link } from "@/shared/i18n";
import { cn } from "@/shared/lib";

import { type TButtonVariantsProps, buttonVariants } from "./button-variants";

type TButtonLinkProps = ComponentProps<typeof Link> & TButtonVariantsProps;

export function ButtonLink({
	className,
	variant,
	size,
	mode,
	...props
}: TButtonLinkProps) {
	return (
		<Link
			className={cn(buttonVariants({ variant, size, mode }), className)}
			{...props}
		/>
	);
}

type TButtonAnchorProps = ComponentProps<"a"> & TButtonVariantsProps;

export function ButtonAnchor({
	className,
	variant,
	size,
	mode,
	...props
}: TButtonAnchorProps) {
	return (
		<a
			className={cn(buttonVariants({ variant, size, mode }), className)}
			{...props}
		/>
	);
}
