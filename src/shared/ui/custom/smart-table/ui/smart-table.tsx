"use client";

import {
	type ColumnFiltersState,
	type PaginationState,
	type SortingState,
	type VisibilityState,
	getCoreRowModel,
	getExpandedRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable
} from "@tanstack/react-table";
import { LayoutGridIcon, StretchHorizontalIcon } from "lucide-react";
import { memo, useCallback, useEffect, useId, useMemo, useState } from "react";

import { cn } from "@/shared/lib";
import {
	Button,
	CustomOptionTabs,
	CustomOptionTabsContent,
	CustomOptionTabsList,
	CustomOptionTabsTrigger
} from "@/shared/ui";
import { DataGrid, DataGridContainer } from "@/shared/ui/shadcn-ui/data-grid";
import { DataGridTable } from "@/shared/ui/shadcn-ui/data-grid-table";
import { DataGridTableDnD } from "@/shared/ui/shadcn-ui/data-grid-table-dnd";

import { type TSmartTableProps, type TViewModeType } from "../model";

import { EmptyState } from "./empty-state";
import { SmartTableFilters } from "./smart-table-filters";
import { SmartTablePagination } from "./smart-table-pagination";

function SmartTableInner<TData extends object>({
	columns,
	data,
	actions,
	defaultExpanded = false,
	showPagination = true,
	showSearchFilter = true,
	showStatusFilter = true,
	showVisibilityFilter = true,
	showTopFilters = true,
	topChildren,
	useViewMode = false,
	defaultViewMode = "table",
	card: Card,
	cardSkeleton: CardSkeleton,
	CardsClassName,
	statusTabs,
	activeStatusTab,
	onStatusTabChange,
	showStatusTabsFilter = false,
	recordCount,
	isLoading = false,
	loadingMode = "skeleton",
	tableLayout,
	pagination: externalPagination,
	defaultPageSize = 10,
	onPaginationChange: externalOnPaginationChange,
	search,
	onSearchChange,
	status,
	onStatusChange,
	statusOptions,
	getSubRows,
	getRowCanExpand,
	searchKey,
	statusKey,
	...props
}: TSmartTableProps<TData>) {
	const id = useId();
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
		{}
	);
	const [internalPagination, setInternalPagination] =
		useState<PaginationState>({
			pageIndex: 0,
			pageSize: defaultPageSize
		});
	const pagination = externalPagination ?? internalPagination;
	const onPaginationChange =
		externalOnPaginationChange ?? setInternalPagination;

	const [sorting, setSorting] = useState<SortingState>([]);
	const getColumnIds = useCallback(
		(cols: typeof columns) =>
			cols
				.map((column) => {
					if ("id" in column && column.id) return column.id as string;
					if ("accessorKey" in column && column.accessorKey)
						return column.accessorKey as string;
					return "";
				})
				.filter(Boolean),
		[]
	);

	const [columnOrder, setColumnOrder] = useState<string[]>(
		getColumnIds(columns)
	);

	// Синхронизация columnOrder при изменении columns
	useEffect(() => {
		setColumnOrder(getColumnIds(columns));
	}, [columns, getColumnIds]);

	const table = useReactTable({
		data,
		columns,
		state: {
			sorting,
			pagination,
			columnFilters,
			columnVisibility,
			columnOrder
		},
		initialState: {
			expanded: defaultExpanded || {}
		},
		onSortingChange: setSorting,
		onPaginationChange,
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		onColumnOrderChange: setColumnOrder,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		...(showPagination || recordCount !== undefined
			? { getPaginationRowModel: getPaginationRowModel() }
			: {}),
		getFilteredRowModel: getFilteredRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
		getExpandedRowModel: getExpandedRowModel(),
		// Keep expanded children on the same page as their parent
		paginateExpandedRows: false,
		getRowCanExpand: getRowCanExpand as any,
		getSubRows,
		columnResizeMode: "onChange",
		enableSortingRemoval: false,
		manualPagination: recordCount !== undefined,
		pageCount:
			recordCount !== undefined
				? Math.ceil(recordCount / pagination.pageSize)
				: -1
	});

	// Если на текущей странице нет данных (после удаления) и это не первая страница,
	// переходим на предыдущую таблицу.
	useEffect(() => {
		if (
			!isLoading &&
			pagination.pageIndex > 0 &&
			data.length === 0 &&
			recordCount !== undefined &&
			recordCount > 0
		) {
			table.setPageIndex(pagination.pageIndex - 1);
		}
	}, [data.length, isLoading, recordCount, pagination.pageIndex, table]);

	const VIEW_CONFIG = useMemo(
		() => [
			...(useViewMode && Card
				? [
						{
							type: "cards" as const,
							component: (
								<div
									className={cn(
										"grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4",
										CardsClassName
									)}
								>
									{isLoading && loadingMode === "skeleton" ? (
										Array.from({
											length: pagination.pageSize
										}).map((_, i) =>
											CardSkeleton ? (
												<CardSkeleton key={i} />
											) : (
												<div
													key={i}
													className="h-64 rounded-xl bg-muted animate-pulse"
												/>
											)
										)
									) : data.length > 0 ? (
										data.map((item, index) => (
											<Card
												key={
													(item as { id?: string })
														.id || index
												}
												data={item}
											/>
										))
									) : (
										<div className="col-span-full">
											<EmptyState />
										</div>
									)}
								</div>
							),
							icon: <LayoutGridIcon className="w-3 h-3" />
						}
					]
				: []),
			{
				type: "table" as const,
				component: (
					<DataGridContainer>
						{tableLayout?.columnsDraggable ||
						tableLayout?.rowsDraggable ? (
							<DataGridTableDnD />
						) : (
							<DataGridTable />
						)}
					</DataGridContainer>
				),
				icon: <StretchHorizontalIcon className="w-3 h-3" />
			}
		],
		[
			useViewMode,
			Card,
			CardsClassName,
			isLoading,
			loadingMode,
			pagination.pageSize,
			CardSkeleton,
			data,
			tableLayout?.columnsDraggable,
			tableLayout?.rowsDraggable
		]
	);

	const [currentView, setCurrentView] =
		useState<TViewModeType>(defaultViewMode);

	return (
		<DataGrid
			table={table}
			recordCount={recordCount ?? data.length}
			isLoading={isLoading}
			loadingMode={loadingMode}
			tableLayout={tableLayout}
			emptyMessage={<EmptyState />}
			{...props}
		>
			<CustomOptionTabs
				value={currentView}
				onValueChange={(val) => setCurrentView(val as TViewModeType)}
			>
				<div className="space-y-4">
					{(topChildren ||
						showTopFilters ||
						actions ||
						useViewMode) && (
						<div
							className={`grid-cols-[1fr_auto] items-center gap-3 ${!!actions || useViewMode ? "grid" : "block"}`}
						>
							{/* <div className="flex items-center gap-3"> */}
							<div className="grid gap-3 grid-cols-[1fr_max-content]">
								{topChildren}
								{showTopFilters && (
									<SmartTableFilters
										id={id}
										table={table}
										showSearchFilter={showSearchFilter}
										showStatusFilter={showStatusFilter}
										showVisibilityFilter={
											showVisibilityFilter
										}
										showStatusTabsFilter={
											showStatusTabsFilter
										}
										statusTabs={statusTabs}
										activeStatusTab={activeStatusTab}
										onStatusTabChange={onStatusTabChange}
										search={search}
										onSearchChange={onSearchChange}
										status={status}
										onStatusChange={onStatusChange}
										statusOptions={statusOptions}
										currentView={currentView}
										searchKey={searchKey}
										statusKey={statusKey}
									/>
								)}
							</div>
							<div
								className={`flex items-center gap-3 ${!!actions || useViewMode ? "flex" : "hidden"}`}
							>
								{actions}
								{useViewMode && (
									<CustomOptionTabsList className="grid-cols-2 gap-2">
										{VIEW_CONFIG.map((item) => (
											<CustomOptionTabsTrigger
												key={item.type}
												value={item.type}
												asChild
											>
												<Button
													variant="outline"
													size="icon"
												>
													{item.icon}
												</Button>
											</CustomOptionTabsTrigger>
										))}
									</CustomOptionTabsList>
								)}
							</div>
						</div>
					)}

					{VIEW_CONFIG.map((item) => (
						<CustomOptionTabsContent
							key={item.type}
							value={item.type}
						>
							{item.component}
						</CustomOptionTabsContent>
					))}

					{showPagination && <SmartTablePagination id={id} />}
				</div>
			</CustomOptionTabs>
		</DataGrid>
	);
}

export const SmartTable = memo(SmartTableInner) as typeof SmartTableInner;
