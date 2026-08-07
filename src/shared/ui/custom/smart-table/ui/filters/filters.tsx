import type { Table } from "@tanstack/react-table";
import { type RefObject } from "react";

import { SearchFilter } from "./search-filter";
import { StatusFilter } from "./status-filter";
import { StatusTabsFilter } from "./status-tabs-filter";
import { VisibilityFilter } from "./visibility-filter";

interface IFiltersProps<TData extends object> extends IShowFilters {
	id: string;
	inputRef: RefObject<HTMLInputElement | null>;
	table: Table<TData>;
	selectedStatuses: string[];
	uniqueStatusValues: string[];
	handleStatusChange: (checked: boolean, value: string) => void;
	currentView?: "table" | "cards";
	searchKey?: keyof TData;
}

export interface IShowFilters {
	showSearchFilter?: boolean;
	showStatusFilter?: boolean;
	showVisibilityFilter?: boolean;
	statusTabs?: { label: string; value: string }[];
	activeStatusTab?: string;
	showStatusTabsFilter?: boolean;
	onStatusTabChange?: (value: string) => void;
	search?: string;
	onSearchChange?: (value: string) => void;
	status?: string[];
	onStatusChange?: (value: string[]) => void;
	statusOptions?: { label: string; value: string }[];
}

export const Filters = <TData extends object>({
	id,
	inputRef,
	table,
	selectedStatuses,
	uniqueStatusValues,
	handleStatusChange,
	showSearchFilter = true,
	showStatusFilter = true,
	showVisibilityFilter = true,
	statusTabs,
	activeStatusTab,
	showStatusTabsFilter = false,
	onStatusTabChange,
	search,
	onSearchChange,
	status: controlledStatus,
	onStatusChange,
	statusOptions,
	currentView = "table",
	searchKey
}: IFiltersProps<TData>) => {
	return (
		<div className="flex justify-between gap-3 w-full">
			{/* Status tabs filter - только для режима карточек */}
			{(currentView === "cards" || showStatusTabsFilter) &&
				statusTabs &&
				statusTabs.length > 0 && (
					<StatusTabsFilter
						statusTabs={statusTabs}
						activeStatusTab={activeStatusTab}
						onStatusTabChange={onStatusTabChange}
					/>
				)}
			<div className="flex items-center gap-3">
				{/* Filter by name or email */}
				{showSearchFilter && (
					<SearchFilter<TData>
						id={id}
						inputRef={inputRef}
						table={table}
						search={search}
						onSearchChange={onSearchChange}
						searchKey={searchKey}
					/>
				)}
				{/* Filter by status - только для режима таблицы */}
				{currentView === "table" &&
					!showStatusTabsFilter &&
					showStatusFilter && (
						<StatusFilter
							id={id}
							selectedStatuses={
								controlledStatus ?? selectedStatuses
							}
							uniqueStatusValues={uniqueStatusValues}
							handleStatusChange={
								onStatusChange
									? (checked: boolean, value: string) => {
											const current =
												controlledStatus ?? [];
											const next = checked
												? [...current, value]
												: current.filter(
														(s: string) =>
															s !== value
													);
											onStatusChange(next);
										}
									: handleStatusChange
							}
							statusOptions={statusOptions}
						/>
					)}
				{/* Toggle columns visibility */}
				{currentView === "table" && showVisibilityFilter && (
					<VisibilityFilter<TData> table={table} />
				)}
			</div>
		</div>
	);
};
