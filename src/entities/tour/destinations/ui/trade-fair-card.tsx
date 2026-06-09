"use client";

import type { FC } from "react";

import { Card } from "@/shared/ui";

import type { ITradeFairCard } from "../types";

interface ITradeFairCardProps {
	data: ITradeFairCard;
}

export const TradeFairCard: FC<ITradeFairCardProps> = ({ data }) => (
	<Card className="flex flex-col gap-3 p-5 sm:p-6">
		<h3 className="text-base font-semibold sm:text-lg">{data.title}</h3>
		<dl className="text-muted-foreground flex flex-col gap-2 text-sm">
			<div>
				<dt className="sr-only">Stand</dt>
				<dd>{data.stand}</dd>
			</div>
			<div>
				<dt className="sr-only">Participants</dt>
				<dd>{data.participants}</dd>
			</div>
			<div>
				<dt className="sr-only">Country</dt>
				<dd className="font-medium text-foreground">{data.country}</dd>
			</div>
		</dl>
	</Card>
);
