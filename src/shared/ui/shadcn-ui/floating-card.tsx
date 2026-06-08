"use client";

import type { CSSProperties, ReactNode } from "react";

import { cn } from "@/shared/lib/index";

export interface FloatingCardProps {
	children: ReactNode;
	className?: string;
	/** Амплитуда покачивания по Y (px) */
	floatOffset?: number;
	/** Длительность полного цикла (сек) */
	duration?: number;
	/** Задержка старта (сек) */
	delay?: number;
	enabled?: boolean;
}

export const FloatingCard = ({
	children,
	className,
	floatOffset = 8,
	duration = 5,
	delay = 0,
	enabled = true
}: FloatingCardProps) => {
	if (!enabled) {
		return <div className={className}>{children}</div>;
	}

	const style = {
		"--float-y": `-${floatOffset}px`,
		"--float-duration": `${duration}s`,
		"--float-delay": `${delay}s`
	} as CSSProperties;

	return (
		<div className={cn("animate-hero-float", className)} style={style}>
			{children}
		</div>
	);
};
