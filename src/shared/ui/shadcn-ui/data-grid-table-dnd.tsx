"use client";

import {
	DndContext,
	type DragEndEvent,
	KeyboardSensor,
	MouseSensor,
	PointerSensor,
	TouchSensor,
	closestCenter,
	useSensor,
	useSensors
} from "@dnd-kit/core";
import {
	restrictToHorizontalAxis,
	restrictToVerticalAxis,
	restrictToWindowEdges
} from "@dnd-kit/modifiers";
import {
	SortableContext,
	arrayMove,
	horizontalListSortingStrategy,
	useSortable,
	verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
	type Cell,
	type Header,
	type HeaderGroup,
	type Row,
	flexRender
} from "@tanstack/react-table";
import { GripVertical } from "lucide-react";
import { useId, useMemo } from "react";

import { Button } from "@/shared/ui";

import { useDataGrid } from "./data-grid";
import {
	DataGridTableBase,
	DataGridTableBody,
	DataGridTableBodyRow,
	DataGridTableBodyRowCell,
	DataGridTableBodyRowSkeleton,
	DataGridTableBodyRowSkeletonCell,
	DataGridTableHead,
	DataGridTableHeadRow,
	DataGridTableHeadRowCell,
	DataGridTableHeadRowCellResize
} from "./data-grid-table";

function DataGridTableHeadRowCellDraggable<TData>({
	header
}: {
	header: Header<TData, unknown>;
}) {
	const { props } = useDataGrid();
	const { column } = header;

	const {
		attributes,
		isDragging,
		listeners,
		setNodeRef,
		transform,
		transition
	} = useSortable({
		id: column.id
	});

	const style: React.CSSProperties = {
		opacity: isDragging ? 0.8 : 1,
		position: "relative",
		transform: CSS.Translate.toString(transform),
		transition,
		width: column.getSize(),
		zIndex: isDragging ? 1 : 0
	};

	return (
		<DataGridTableHeadRowCell
			header={header}
			dndRef={setNodeRef}
			dndStyle={style}
		>
			<div className="flex items-center justify-start gap-1">
				<Button
					variant="dim"
					size="sm"
					mode="icon"
					className="-ms-2 size-6 shrink-0 cursor-grab active:cursor-grabbing"
					{...attributes}
					{...listeners}
					aria-label="Drag to reorder"
				>
					<GripVertical
						className="opacity-50 size-3"
						aria-hidden="true"
					/>
				</Button>
				<div className="truncate">
					{header.isPlaceholder
						? null
						: flexRender(
								header.column.columnDef.header,
								header.getContext()
							)}
				</div>
			</div>
			{props.tableLayout?.columnsResizable && column.getCanResize() && (
				<DataGridTableHeadRowCellResize header={header} />
			)}
		</DataGridTableHeadRowCell>
	);
}

function DataGridTableBodyRowCellDraggable<TData>({
	cell
}: {
	cell: Cell<TData, unknown>;
}) {
	const { isDragging, setNodeRef, transform, transition } = useSortable({
		id: cell.column.id
	});

	const style: React.CSSProperties = {
		opacity: isDragging ? 0.8 : 1,
		position: "relative",
		transform: CSS.Translate.toString(transform),
		transition,
		width: cell.column.getSize(),
		zIndex: isDragging ? 1 : 0
	};

	return (
		<DataGridTableBodyRowCell
			cell={cell}
			dndRef={setNodeRef}
			dndStyle={style}
		>
			{flexRender(cell.column.columnDef.cell, cell.getContext())}
		</DataGridTableBodyRowCell>
	);
}

function DataGridTableBodyRowDraggable<TData>({
	row,
	columnIds
}: {
	row: Row<TData>;
	columnIds: string[];
}) {
	const { props } = useDataGrid();
	const {
		attributes,
		isDragging,
		listeners,
		setNodeRef,
		transform,
		transition
	} = useSortable({
		id: row.id
	});

	const style: React.CSSProperties = {
		opacity: isDragging ? 0.8 : 1,
		position: "relative",
		transform: CSS.Translate.toString(transform),
		transition,
		zIndex: isDragging ? 1 : 0
	};

	return (
		<DataGridTableBodyRow row={row} dndRef={setNodeRef} dndStyle={style}>
			<SortableContext
				items={columnIds}
				strategy={horizontalListSortingStrategy}
			>
				{row
					.getVisibleCells()
					.map((cell: Cell<TData, unknown>, colIndex) => {
						if (props.tableLayout?.columnsDraggable) {
							return (
								<DataGridTableBodyRowCellDraggable
									cell={cell}
									key={colIndex}
								/>
							);
						}
						return (
							<DataGridTableBodyRowCell
								cell={cell}
								key={colIndex}
								{...(props.tableLayout?.rowsDraggable
									? { ...attributes, ...listeners }
									: {})}
							>
								{flexRender(
									cell.column.columnDef.cell,
									cell.getContext()
								)}
							</DataGridTableBodyRowCell>
						);
					})}
			</SortableContext>
		</DataGridTableBodyRow>
	);
}

function DataGridTableDnD<TData extends { id: string }>() {
	const { table, isLoading, props } = useDataGrid();
	const pagination = table.getState().pagination;

	const columnOrder = table.getState().columnOrder;
	const tableRows = table.getRowModel().rows;
	const columnIds = useMemo(() => columnOrder, [columnOrder]);
	const rowIds = useMemo(() => tableRows.map((row) => row.id), [tableRows]);

	const sensors = useSensors(
		useSensor(MouseSensor, {}),
		useSensor(TouchSensor, {}),
		useSensor(PointerSensor, {}),
		useSensor(KeyboardSensor, {})
	);

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;
		if (active && over && active.id !== over.id) {
			if (
				props.tableLayout?.columnsDraggable &&
				columnIds.includes(active.id as string)
			) {
				const oldIndex = columnIds.indexOf(active.id as string);
				const newIndex = columnIds.indexOf(over.id as string);
				table.setColumnOrder(arrayMove(columnIds, oldIndex, newIndex));
			} else if (
				props.tableLayout?.rowsDraggable &&
				rowIds.includes(active.id as string)
			) {
				const oldIndex = rowIds.indexOf(active.id as string);
				const newIndex = rowIds.indexOf(over.id as string);

				// If there's a custom handler in SmartTable props (needs to be passed via context or props)
				// For now, we assume SmartTable will handle it if we expose it
				if ((props as any).onRowsReorder) {
					(props as any).onRowsReorder(oldIndex, newIndex);
				}
			}
		}
	}

	return (
		<DndContext
			id={useId()}
			sensors={sensors}
			collisionDetection={closestCenter}
			modifiers={
				props.tableLayout?.rowsDraggable
					? [restrictToVerticalAxis]
					: [restrictToHorizontalAxis, restrictToWindowEdges]
			}
			onDragEnd={handleDragEnd}
		>
			<DataGridTableBase>
				<DataGridTableHead>
					{table
						.getHeaderGroups()
						.map((headerGroup: HeaderGroup<TData>, index) => (
							<DataGridTableHeadRow
								headerGroup={headerGroup}
								key={index}
							>
								<SortableContext
									items={columnIds}
									strategy={horizontalListSortingStrategy}
								>
									{headerGroup.headers.map(
										(header, index) => (
											<DataGridTableHeadRowCellDraggable
												header={header}
												key={index}
											/>
										)
									)}
								</SortableContext>
							</DataGridTableHeadRow>
						))}
				</DataGridTableHead>

				<DataGridTableBody>
					{props.loadingMode === "skeleton" &&
					isLoading &&
					pagination?.pageSize ? (
						Array.from({ length: pagination.pageSize }).map(
							(_, rowIndex) => (
								<DataGridTableBodyRowSkeleton key={rowIndex}>
									{table
										.getVisibleFlatColumns()
										.map((column, colIndex) => {
											return (
												<DataGridTableBodyRowSkeletonCell
													column={column}
													key={colIndex}
												>
													{
														column.columnDef.meta
															?.skeleton
													}
												</DataGridTableBodyRowSkeletonCell>
											);
										})}
								</DataGridTableBodyRowSkeleton>
							)
						)
					) : props.tableLayout?.rowsDraggable ? (
						<SortableContext
							items={rowIds}
							strategy={verticalListSortingStrategy}
						>
							{table
								.getRowModel()
								.rows.map((row: Row<TData>, index) => (
									<DataGridTableBodyRowDraggable
										row={row}
										key={index}
										columnIds={columnIds}
									/>
								))}
						</SortableContext>
					) : (
						table
							.getRowModel()
							.rows.map((row: Row<TData>, index) => (
								<DataGridTableBodyRowDraggable
									row={row}
									key={index}
									columnIds={columnIds}
								/>
							))
					)}
				</DataGridTableBody>
			</DataGridTableBase>
		</DndContext>
	);
}

export { DataGridTableDnD };
