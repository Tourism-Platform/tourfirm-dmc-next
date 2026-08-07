"use client";

import { ChevronLeft, FileSearch } from "lucide-react";
import { type FC } from "react";

import { ENUM_PATH } from "@/shared/config";
import { Link } from "@/shared/i18n";
import { Button } from "@/shared/ui";
import { useUiContent } from "@/shared/ui-content";

export const OrderNotFound: FC = () => {
	const { orders } = useUiContent();

	return (
		<div className="flex h-[60vh] flex-col items-center justify-center gap-6">
			<div className="flex flex-col items-center gap-4 text-center">
				<div className="rounded-full bg-muted p-6">
					<FileSearch className="h-12 w-12 text-primary" />
				</div>
				<h1 className="text-2xl font-bold tracking-tight">
					{orders.notFound.title}
				</h1>
				<p className="max-w-[600px] text-muted-foreground">
					{orders.notFound.description}
				</p>
			</div>

			<Button variant="ghost" size="sm" asChild className="text-primary">
				<Link href={ENUM_PATH.BOOKING.ROOT}>
					<ChevronLeft className="mr-2 h-4 w-4" />
					{orders.buttons.back}
				</Link>
			</Button>
		</div>
	);
};
