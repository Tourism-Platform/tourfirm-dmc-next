"use client";

import type { FC, ReactNode } from "react";

import { cn } from "@/shared/lib/utils";
import { NavIcon } from "@/shared/ui/nav-icon";

type TNavEntryLabelProps = {
	icon?: string;
	label: string;
	variant?: "trigger" | "dropdown";
	className?: string;
	labelClassName?: string;
	muted?: boolean;
	suffix?: ReactNode;
};

export const NavEntryLabel: FC<TNavEntryLabelProps> = ({
	icon,
	label,
	variant = "trigger",
	className,
	labelClassName,
	muted = false,
	suffix
}) => {
	if (variant === "trigger") {
		return (
			<span className={cn("inline-flex items-center gap-1.5", className)}>
				{icon ? (
					<NavIcon
						name={icon}
						className="size-4 shrink-0 opacity-80"
					/>
				) : null}
				<span className={labelClassName}>{label}</span>
			</span>
		);
	}

	return (
		<>
			<span
				className={cn(
					"flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary",
					muted && "bg-muted/50 text-muted-foreground",
					className
				)}
			>
				<NavIcon name={icon} className="size-4" />
			</span>
			<span className="min-w-0">
				<span className="flex items-center gap-2">
					<span
						className={cn(
							"block text-[13px] font-medium leading-tight",
							muted && "text-muted-foreground",
							labelClassName
						)}
					>
						{label}
					</span>
					{suffix}
				</span>
			</span>
		</>
	);
};
