"use client";

import { Slot } from "@radix-ui/react-slot";
import { type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/shared/lib/utils";

import { buttonVariants } from "./button-variants";

export type TButtonVariantsProps = VariantProps<typeof buttonVariants>;

function Button({
	className,
	variant,
	size,
	mode,
	asChild = false,
	...props
}: React.ComponentProps<"button"> &
	VariantProps<typeof buttonVariants> & {
		asChild?: boolean;
	}) {
	const Comp = asChild ? Slot : "button";

	return (
		<Comp
			data-slot="button"
			className={cn(buttonVariants({ variant, size, mode, className }))}
			{...props}
		/>
	);
}

export { Button };
