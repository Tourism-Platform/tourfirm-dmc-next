import {
	type ColumnDef,
	type OnChangeFn,
	type PaginationState
} from "@tanstack/react-table";
import { type FC, type ReactNode } from "react";

import { type DataGridProps } from "@/shared/ui/shadcn-ui/data-grid";

export type TViewModeType = "table" | "cards";

export interface IViewModeBase {
	useViewMode?: boolean;
	defaultViewMode?: TViewModeType;
	cardSkeleton?: FC;
}

export interface IViewModeEnabled<TData extends object> extends IViewModeBase {
	useViewMode: true;
	card: FC<{ data: TData }>;
	CardsClassName?: string;
}

export interface IViewModeDisabled extends IViewModeBase {
	useViewMode?: false;
	card?: never;
	CardsClassName?: never;
}

export type TViewMode<TData extends object> =
	| IViewModeEnabled<TData>
	| IViewModeDisabled;

export interface ISmartTableFilters {
	showTopFilters?: boolean;
	showSearchFilter?: boolean;
	showStatusFilter?: boolean;
	showVisibilityFilter?: boolean;
	search?: string;
	onSearchChange?: (value: string) => void;
	status?: string[];
	onStatusChange?: (value: string[]) => void;
	statusOptions?: { label: string; value: string }[];
}

export interface ISmartTableProps<TData extends object> extends Omit<
	DataGridProps<TData>,
	"children" | "recordCount"
> {
	columns: ColumnDef<TData, unknown>[];
	data: TData[];
	recordCount?: number;
	actions?: ReactNode;
	topChildren?: ReactNode;
	statusTabs?: { label: string; value: string }[];
	activeStatusTab?: string;
	onStatusTabChange?: (value: string) => void;
	showStatusTabsFilter?: boolean;
	showPagination?: boolean;
	pagination?: PaginationState;
	defaultPageSize?: number;
	onPaginationChange?: OnChangeFn<PaginationState>;
	getSubRows?: (row: TData) => TData[] | undefined;
	getRowCanExpand?: (row: { original: TData }) => boolean;
	onRowsReorder?: (oldIndex: number, newIndex: number) => void;
	searchKey?: keyof TData;
	statusKey?: keyof TData;
	defaultExpanded?: boolean;
}

export type TSmartTableProps<TData extends object> = ISmartTableProps<TData> &
	ISmartTableFilters &
	TViewMode<TData>;

export interface IStatusTabs {
	label: string;
	value: string;
}
