import { type VariantProps, cva } from "class-variance-authority";
import { Slot } from "radix-ui";
import * as React from "react";

import { cn } from "@/shared/lib";

const badgeVariants = cva(
	"inline-flex items-center justify-center rounded-md border px-1.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] transition-[color,box-shadow] [&>svg]:shrink-0 leading-normal",
	{
		variants: {
			variant: {
				default:
					"border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
				secondary:
					"border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
				destructive:
					"border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
				outline:
					"text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
				red: "bg-red-500/20 text-red-600 border-none rounded-sm",
				green: "bg-green-500/20 text-green-600 border-none rounded-sm",
				blue: "bg-blue-500/20 text-blue-600 border-none rounded-sm",
				yellow: "bg-yellow-500/20 text-yellow-600 border-none rounded-sm",
				orange: "bg-orange-500/20 text-orange-600 border-none rounded-sm",
				cyan: "bg-cyan-500/20 text-cyan-600 border-none rounded-sm"
			},
			size: {
				sm: "h-6 px-2.5 text-xs",
				md: "h-8 px-3.5 text-sm",
				lg: "h-10 px-4.5 text-base"
			}
		},
		defaultVariants: {
			variant: "default"
		}
	}
);

export type BadgeVariant = VariantProps<typeof badgeVariants>["variant"];
export type BadgeSize = VariantProps<typeof badgeVariants>["size"];

function Badge({
	className,
	variant,
	size,
	asChild = false,
	...props
}: React.ComponentProps<"span"> &
	VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
	const Comp = asChild ? Slot.Root : "span";

	return (
		<Comp
			data-slot="badge"
			className={cn(badgeVariants({ variant, size }), className)}
			{...props}
		/>
	);
}

export { Badge, badgeVariants };
