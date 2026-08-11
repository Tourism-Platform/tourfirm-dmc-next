"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

import { getCountryLabel } from "@/shared/lib/countries";
import { Button } from "@/shared/ui";
import type { TUiOrders } from "@/shared/ui-content";

import {
	Gender,
	type TPaxReviewDetail,
	type TPaxReviewItem
} from "@/entities/booking";

export const PAX_REVIEW_COLUMNS = (
	labels: TUiOrders["paxInformation"]["table"],
	renderSubTable: (items: TPaxReviewDetail[]) => ReactNode
): ColumnDef<TPaxReviewItem, unknown>[] => [
	{
		id: "expand",
		header: () => null,
		size: 40,
		cell: ({
			row: { getCanExpand, getToggleExpandedHandler, getIsExpanded }
		}) => {
			return getCanExpand() ? (
				<Button
					onClick={getToggleExpandedHandler()}
					variant="ghost"
					size="icon"
					type="button"
				>
					{getIsExpanded() ? (
						<ChevronDown className="size-4 text-muted-foreground" />
					) : (
						<ChevronRight className="size-4 text-muted-foreground" />
					)}
				</Button>
			) : null;
		},
		meta: {
			expandedContent: ({ items }: TPaxReviewItem) =>
				renderSubTable(items)
		}
	},
	{
		accessorKey: "fullName",
		header: labels.fullName
	},
	{
		accessorKey: "gender",
		header: labels.gender,
		cell: ({ row }) =>
			row.original.gender === Gender.F
				? labels.genders.female
				: labels.genders.male
	},
	{
		accessorKey: "nationality",
		header: labels.nationality,
		cell: ({ row }) => getCountryLabel(row.original.nationality, "en")
	},
	{
		accessorKey: "dateOfBirth",
		header: labels.dateOfBirth
	},
	{
		accessorKey: "passportNumber",
		header: labels.passportNumber
	},
	{
		accessorKey: "expiredDate",
		header: labels.expiredDate
	}
];
