"use client";

import { Settings2 } from "lucide-react";

import { cn } from "@/shared/lib";

import { Button } from "./button";
import { useDataGrid } from "./data-grid";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "./dropdown-menu";

interface DataGridColumnVisibilityProps {
	className?: string;
	title?: string;
}

function DataGridColumnVisibility({
	className,
	title = "View"
}: DataGridColumnVisibilityProps) {
	const { table } = useDataGrid();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="outline"
					size="sm"
					className={cn("ms-auto hidden h-8 lg:flex", className)}
				>
					<Settings2 className="me-2 h-4 w-4" />
					{title}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-[150px]">
				<DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{table
					.getAllColumns()
					.filter(
						(column) =>
							typeof column.accessorFn !== "undefined" &&
							column.getCanHide()
					)
					.map((column) => {
						return (
							<DropdownMenuCheckboxItem
								key={column.id}
								className="capitalize"
								checked={column.getIsVisible()}
								onCheckedChange={(value) =>
									column.toggleVisibility(!!value)
								}
							>
								{column.columnDef.meta?.headerTitle ||
									column.id}
							</DropdownMenuCheckboxItem>
						);
					})}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export { DataGridColumnVisibility };
