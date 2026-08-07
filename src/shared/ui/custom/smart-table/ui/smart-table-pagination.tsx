"use client";

import { type Table } from "@tanstack/react-table";
import {
	ChevronFirstIcon,
	ChevronLastIcon,
	ChevronLeftIcon,
	ChevronRightIcon
} from "lucide-react";
import { type FC } from "react";

import {
	Button,
	Label,
	Pagination,
	PaginationContent,
	PaginationItem,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/shared/ui";
import { useDataGrid } from "@/shared/ui/shadcn-ui/data-grid";

interface SmartTablePaginationProps {
	id: string;
	table?: Table<object>;
	recordCount?: number;
}

export const SmartTablePagination: FC<SmartTablePaginationProps> = ({
	id,
	table: externalTable,
	recordCount: externalRecordCount
}) => {
	const dataGridContext = useDataGrid();
	const table = externalTable ?? dataGridContext.table;
	const recordCount = externalRecordCount ?? dataGridContext.recordCount;

	const { pageIndex, pageSize } = table.getState().pagination;

	return (
		<div className="flex items-center justify-between gap-8">
			<div className="flex items-center gap-3">
				<Label
					htmlFor={id}
					className="max-sm:sr-only text-muted-foreground text-sm"
				>
					Rows per page
				</Label>
				<Select
					value={pageSize.toString()}
					onValueChange={(value) => {
						table.setPageSize(Number(value));
					}}
				>
					<SelectTrigger
						id={id}
						className="h-9 w-fit whitespace-nowrap"
					>
						<SelectValue placeholder="Select number of results" />
					</SelectTrigger>
					<SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2">
						{[5, 10, 25, 50, 100].map((size) => (
							<SelectItem key={size} value={size.toString()}>
								{size}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div className="text-muted-foreground flex grow justify-end text-sm whitespace-nowrap">
				<p aria-live="polite">
					<span className="text-foreground font-medium">
						{pageIndex * pageSize + 1}-
						{Math.min((pageIndex + 1) * pageSize, recordCount)}
					</span>{" "}
					of{" "}
					<span className="text-foreground font-medium">
						{recordCount}
					</span>
				</p>
			</div>

			<div>
				<Pagination>
					<PaginationContent className="gap-1">
						<PaginationItem>
							<Button
								size="icon"
								variant="outline"
								className="size-9 disabled:pointer-events-none disabled:opacity-50"
								onClick={() => table.setPageIndex(0)}
								disabled={!table.getCanPreviousPage()}
								aria-label="Go to first page"
							>
								<ChevronFirstIcon
									size={16}
									aria-hidden="true"
								/>
							</Button>
						</PaginationItem>
						<PaginationItem>
							<Button
								size="icon"
								variant="outline"
								className="size-9 disabled:pointer-events-none disabled:opacity-50"
								onClick={() => table.previousPage()}
								disabled={!table.getCanPreviousPage()}
								aria-label="Go to previous page"
							>
								<ChevronLeftIcon size={16} aria-hidden="true" />
							</Button>
						</PaginationItem>
						<PaginationItem>
							<Button
								size="icon"
								variant="outline"
								className="size-9 disabled:pointer-events-none disabled:opacity-50"
								onClick={() => table.nextPage()}
								disabled={!table.getCanNextPage()}
								aria-label="Go to next page"
							>
								<ChevronRightIcon
									size={16}
									aria-hidden="true"
								/>
							</Button>
						</PaginationItem>
						<PaginationItem>
							<Button
								size="icon"
								variant="outline"
								className="size-9 disabled:pointer-events-none disabled:opacity-50"
								onClick={() =>
									table.setPageIndex(table.getPageCount() - 1)
								}
								disabled={!table.getCanNextPage()}
								aria-label="Go to last page"
							>
								<ChevronLastIcon size={16} aria-hidden="true" />
							</Button>
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			</div>
		</div>
	);
};
