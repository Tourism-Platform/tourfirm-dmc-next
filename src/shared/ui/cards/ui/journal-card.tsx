import Image from "next/image";

import { Card } from "../../shadcn-ui/card";
import type { TJournalCardProps } from "../types/journal-card.types";

export function JournalCard({ data }: TJournalCardProps) {
	return (
		<Card className="flex flex-col overflow-hidden p-0">
			<div className="relative h-40">
				<Image
					src={data.imageUrl}
					alt={data.title}
					fill
					className="object-cover"
					sizes="(max-width: 768px) 100vw, 33vw"
				/>
			</div>
			<div className="flex flex-1 flex-col gap-2 p-5">
				<span className="text-muted-foreground text-xs">
					{data.meta}
				</span>
				<h3 className="text-base font-semibold leading-snug">
					{data.title}
				</h3>
			</div>
		</Card>
	);
}
