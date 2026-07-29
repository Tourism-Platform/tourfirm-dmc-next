"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useRef } from "react";

import { cn } from "@/shared/lib/utils";
import type { TItineraryItemProps } from "@/shared/ui/blocks/types/block-render.types";

type TItineraryListProps = {
	items: TItineraryItemProps[];
};

function formatDayLabel(index: number): string {
	return String(index + 1).padStart(2, "0");
}

export function ItineraryList({ items }: TItineraryListProps) {
	const rootRef = useRef<HTMLDivElement>(null);
	const reduceMotion = useReducedMotion();

	if (!items.length) {
		return null;
	}

	return (
		<div ref={rootRef} className="relative">
			<motion.div
				aria-hidden
				initial={reduceMotion ? false : { scaleY: 0, opacity: 0.35 }}
				whileInView={{ scaleY: 1, opacity: 1 }}
				viewport={{ once: true, amount: 0.05 }}
				transition={{ duration: 1, ease: [0.22, 0.9, 0.3, 1] }}
				className="bg-primary absolute top-2.5 bottom-8 left-[5.35rem] hidden w-0.5 origin-top sm:block"
			/>
			<ul className="flex flex-col">
				{items.map((item, index) => {
					const isLast = index === items.length - 1;
					const dayLabel = formatDayLabel(index);

					return (
						<motion.li
							key={item.key ?? String(index)}
							initial={
								reduceMotion ? false : { opacity: 0, y: 28 }
							}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{
								once: true,
								amount: 0.2,
								margin: "0px 0px -12% 0px"
							}}
							transition={{
								duration: 0.65,
								ease: [0.22, 0.9, 0.3, 1],
								delay: Math.min(index, 3) * 0.06
							}}
							className={cn(
								"grid grid-cols-1 gap-4 border-border/60 border-t py-5 sm:grid-cols-[8rem_minmax(0,1fr)_11.875rem_10.5rem] sm:gap-7 sm:py-6",
								isLast && "border-b"
							)}
						>
							<div className="flex items-center gap-4">
								<span className="text-muted-foreground font-mono text-xs tracking-[0.1em]">
									{dayLabel}
								</span>
								<span
									aria-hidden
									className={cn(
										"border-primary relative left-1 hidden size-2.5 rounded-full border-[2.5px] bg-background sm:block",
										isLast &&
											"bg-primary left-0.5 size-3.5 border-none shadow-[0_0_0_5px_color-mix(in_oklab,var(--primary)_18%,transparent)]"
									)}
								/>
							</div>

							<div className="min-w-0">
								<h3 className="mb-2 text-lg font-semibold tracking-tight sm:text-xl">
									{item.title}
								</h3>
								{item.description ? (
									<p className="text-muted-foreground max-w-xl text-sm leading-relaxed sm:text-[15px]">
										{item.description}
									</p>
								) : null}
							</div>

							{item.imageSrc ? (
								<div className="relative h-28 overflow-hidden rounded-xl sm:h-[7rem]">
									<Image
										src={item.imageSrc}
										alt={item.title}
										fill
										className="object-cover"
										sizes="190px"
									/>
								</div>
							) : (
								<div className="bg-muted hidden h-[7rem] rounded-xl sm:block" />
							)}

							{item.meta ? (
								<div className="text-muted-foreground font-mono text-[11px] leading-[1.8] tracking-[0.06em] whitespace-pre-line">
									{item.meta}
								</div>
							) : null}
						</motion.li>
					);
				})}
			</ul>
		</div>
	);
}
