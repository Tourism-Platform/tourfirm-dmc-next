"use client";

import Image from "next/image";
import type { FC } from "react";

import { Link } from "@/shared/i18n";
import { Card } from "@/shared/ui";

import type { IJournalCard } from "../types";

interface IJournalCardProps {
	data: IJournalCard;
	statusLabel: string;
}

export const JournalCard: FC<IJournalCardProps> = ({ data, statusLabel }) => (
	<Card className="flex flex-col overflow-hidden p-0">
		<div className="relative h-40">
			<Image
				src={data.imageUrl}
				alt={data.imageAlt}
				fill
				className="object-cover"
				sizes="(max-width: 768px) 100vw, 33vw"
			/>
		</div>
		<div className="flex flex-1 flex-col gap-2 p-5">
			<span className="text-muted-foreground text-xs">{data.meta}</span>
			<h3 className="text-base font-semibold leading-snug">
				{data.title}
			</h3>
			<span className="text-primary text-xs font-medium">
				{statusLabel}
			</span>
			<Link href={data.href} className="sr-only">
				{data.title}
			</Link>
		</div>
	</Card>
);
