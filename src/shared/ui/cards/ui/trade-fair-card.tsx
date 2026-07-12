import { Link } from "@/shared/i18n";

import { Badge } from "../../shadcn-ui/badge";
import { Card } from "../../shadcn-ui/card";
import type { TTradeFairCardProps } from "../types/trade-fair-card.types";

export function TradeFairCard({ data }: TTradeFairCardProps) {
	const content = (
		<Card className="flex h-full flex-col gap-3 p-5 transition-shadow hover:shadow-md sm:p-6">
			<div className="flex items-start justify-between gap-3">
				<h3 className="text-base font-semibold sm:text-lg">
					{data.title}
				</h3>
				<Badge variant="secondary" className="shrink-0">
					{data.country}
				</Badge>
			</div>
			<dl className="text-muted-foreground flex flex-col gap-1.5 text-sm">
				<div>
					<dt className="sr-only">Stand</dt>
					<dd>{data.stand}</dd>
				</div>
				<div>
					<dt className="sr-only">Participants</dt>
					<dd>{data.participants}</dd>
				</div>
			</dl>
		</Card>
	);

	if (data.href) {
		return (
			<Link href={data.href} className="block h-full">
				{content}
			</Link>
		);
	}

	return content;
}
