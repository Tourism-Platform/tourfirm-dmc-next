import type { Table } from "@tanstack/react-table";
import { Columns3Icon } from "lucide-react";

import { Button } from "@/shared/ui";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuTrigger
} from "@/shared/ui";

interface IVisibilityFilterProps<TData extends object> {
	table: Table<TData>;
}

export const VisibilityFilter = <TData extends object>({
	table
}: IVisibilityFilterProps<TData>) => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline">
					<Columns3Icon
						className="-ms-1 opacity-60"
						size={16}
						aria-hidden="true"
					/>
					View
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
				{table
					.getAllColumns()
					.filter((column) => column.getCanHide())
					.map((column) => {
						const label =
							column.columnDef.meta?.headerTitle ?? column.id;
						return (
							<DropdownMenuCheckboxItem
								key={column.id}
								className="capitalize"
								checked={column.getIsVisible()}
								onCheckedChange={(value) =>
									column.toggleVisibility(!!value)
								}
								onSelect={(event) => event.preventDefault()}
							>
								{label}
							</DropdownMenuCheckboxItem>
						);
					})}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
