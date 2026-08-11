"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { FileText } from "lucide-react";

import type { TUiOrders } from "@/shared/ui-content";

import { type TPaxReviewDetail } from "@/entities/booking";

export const PAX_DETAILS_COLUMNS = (
	labels: TUiOrders["paxInformation"]["table"]
): ColumnDef<TPaxReviewDetail>[] => [
	{
		accessorKey: "type",
		size: 200,
		cell: ({ getValue }) => {
			const type = getValue() as string;
			const label =
				type === "comment"
					? labels.comment
					: type === "file"
						? labels.file
						: type;

			return (
				<span className="pl-12 font-medium text-muted-foreground">
					{label}
				</span>
			);
		}
	},
	{
		accessorKey: "value",
		cell: ({ row: { original } }) => {
			const { type, value, file } = original;

			if (type === "file") {
				const fileName = file?.fileName || value;

				return (
					<div className="flex max-w-md items-center gap-4 rounded-xl border border-border/40 bg-muted/20 p-3 text-foreground">
						<div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
							<FileText className="size-5" />
						</div>
						<div className="min-w-0 flex-1">
							<div className="truncate text-sm font-semibold">
								{fileName}
							</div>
						</div>
					</div>
				);
			}

			if (type === "comment") {
				return (
					<div className="leading-relaxed text-foreground italic">
						{value}
					</div>
				);
			}

			return <div className="text-foreground">{value}</div>;
		}
	}
];
