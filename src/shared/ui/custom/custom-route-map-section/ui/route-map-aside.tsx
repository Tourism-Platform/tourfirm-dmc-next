"use client";

import { ArrowRight } from "lucide-react";

import type { TRouteMapAsideProps } from "@/shared/ui/blocks/types/block-render.types";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger
} from "@/shared/ui/shadcn-ui/accordion";
import { Badge } from "@/shared/ui/shadcn-ui/badge";

type TRouteMapAsideComponentProps = TRouteMapAsideProps;

export function RouteMapAside({
	eyebrow,
	title,
	description,
	items = []
}: TRouteMapAsideComponentProps) {
	const defaultOpen = items[0]?.key ?? "0";

	return (
		<div className="bg-foreground text-background flex min-w-0 w-full flex-col gap-5 overflow-hidden rounded-2xl p-5 sm:gap-6 sm:p-6 lg:h-full lg:p-7">
			<div className="flex min-w-0 flex-col gap-3">
				{eyebrow ? (
					<p className="font-mono text-primary text-xs font-medium uppercase tracking-[0.16em] sm:text-sm">
						{eyebrow}
					</p>
				) : null}
				{title ? (
					<h3 className="font-serif text-2xl font-normal italic break-words sm:text-3xl">
						{title}
					</h3>
				) : null}
				{description ? (
					<p className="text-background/70 text-sm break-words sm:text-base">
						{description}
					</p>
				) : null}
			</div>

			{items.length > 0 ? (
				<Accordion
					type="single"
					collapsible
					defaultValue={defaultOpen}
					className="w-full"
				>
					{items.map((item, index) => {
						const value = item.key ?? String(index);
						const number = String(index + 1).padStart(2, "0");

						return (
							<AccordionItem
								key={value}
								value={value}
								className="border-background/15 border-b last:border-b-0"
							>
								<AccordionTrigger className="group py-4 text-base font-semibold text-background hover:no-underline sm:text-lg [&>svg]:hidden">
									<span className="flex min-w-0 flex-1 items-center gap-3 text-left">
										<span className="text-primary font-mono text-sm tabular-nums">
											{number}
										</span>
										<span className="min-w-0 flex-1 break-words">
											{item.title}
										</span>
										<span className="border-background/25 text-background ml-auto flex size-8 shrink-0 items-center justify-center rounded-full border transition-transform duration-300 ease-out group-data-[state=open]:rotate-90">
											<ArrowRight className="size-3.5" />
										</span>
									</span>
								</AccordionTrigger>
								<AccordionContent className="pb-4">
									{item.badge ? (
										<Badge
											variant="secondary"
											size="sm"
											className="mb-3 rounded-full"
										>
											{item.badge}
										</Badge>
									) : null}
									{item.description ? (
										<p className="text-background/65 text-sm leading-relaxed break-words sm:text-base">
											{item.description}
										</p>
									) : null}
								</AccordionContent>
							</AccordionItem>
						);
					})}
				</Accordion>
			) : null}
		</div>
	);
}
