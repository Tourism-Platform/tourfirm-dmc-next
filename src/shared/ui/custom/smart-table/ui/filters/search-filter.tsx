import type { Table } from "@tanstack/react-table";
import { CircleXIcon, ListFilterIcon } from "lucide-react";
import { type RefObject, useEffect, useState } from "react";

import { useDebounce } from "@/shared/hooks";
import { cn } from "@/shared/lib";
import { Input } from "@/shared/ui";

interface ISearchFilterProps<TData extends object> {
	id: string;
	inputRef: RefObject<HTMLInputElement | null>;
	table: Table<TData>;
	search?: string;
	onSearchChange?: (value: string) => void;
	searchKey?: keyof TData;
}

export const SearchFilter = <TData extends object>({
	id,
	inputRef,
	table,
	search,
	onSearchChange,
	searchKey = "name" as keyof TData
}: ISearchFilterProps<TData>) => {
	const isControlled = search !== undefined;
	const externalValue = isControlled
		? search
		: ((table.getColumn(searchKey as string)?.getFilterValue() ??
				"") as string);

	const [localSearch, setLocalSearch] = useState(externalValue);
	const [prevExternalValue, setPrevExternalValue] = useState(externalValue);
	const debouncedSearch = useDebounce(localSearch, 500);

	if (externalValue !== prevExternalValue) {
		setPrevExternalValue(externalValue);
		setLocalSearch(externalValue);
	}

	useEffect(() => {
		if (debouncedSearch === externalValue) return;

		const shouldApply =
			debouncedSearch.length === 0 || debouncedSearch.length >= 3;

		if (shouldApply) {
			if (onSearchChange) {
				onSearchChange(debouncedSearch);
			} else {
				table
					.getColumn(searchKey as string)
					?.setFilterValue(debouncedSearch);
			}
		}
	}, [debouncedSearch, onSearchChange, table, externalValue, searchKey]);

	return (
		<div className="relative">
			<Input
				id={`${id}-input`}
				ref={inputRef}
				className={cn(
					"peer min-w-60 ps-9",
					Boolean(localSearch) && "pe-9"
				)}
				value={localSearch}
				onChange={(e) => {
					setLocalSearch(e.target.value);
				}}
				placeholder="Search"
				type="text"
				aria-label="Search"
			/>
			<div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
				<ListFilterIcon size={16} aria-hidden="true" />
			</div>
			{Boolean(localSearch) && (
				<button
					className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
					aria-label="Clear filter"
					onClick={() => {
						setLocalSearch("");
						if (inputRef.current) {
							inputRef.current.focus();
						}
					}}
				>
					<CircleXIcon size={16} aria-hidden="true" />
				</button>
			)}
		</div>
	);
};
