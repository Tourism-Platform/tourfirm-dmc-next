"use client";

import type { FC } from "react";

import { Link } from "@/shared/i18n";
import { splitDiscoveryNavColumns } from "@/shared/lib/routing/split-discovery-nav-columns";
import { cn } from "@/shared/lib/utils";
import type { TDiscoveryNavItem } from "@/shared/types/discovery-nav.types";

type TProps = {
	items: TDiscoveryNavItem[];
	columnTitle?: string;
	className?: string;
	mobile?: boolean;
};

const itemLinkClassName =
	"block rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:outline-none";

function DiscoveryNavItemLink({ item }: { item: TDiscoveryNavItem }) {
	return (
		<Link href={item.href} className={itemLinkClassName}>
			<span>{item.title}</span>
			{item.subtitle ? (
				<span className="mt-0.5 block text-xs font-normal text-muted-foreground line-clamp-4">
					{item.subtitle}
				</span>
			) : null}
		</Link>
	);
}

function getGridColumnClass(columnCount: number) {
	return {
		"grid-cols-1": columnCount === 1,
		"grid-cols-2": columnCount === 2,
		"grid-cols-3": columnCount === 3
	};
}

export const FlatDiscoveryNavColumns: FC<TProps> = ({
	items,
	columnTitle,
	className,
	mobile = false
}) => {
	const columns = splitDiscoveryNavColumns(items);

	if (!columns.length) {
		return null;
	}

	const columnCount = columns.length;

	if (mobile) {
		return (
			<div className={cn("flex flex-col", className)}>
				{columnTitle && !mobile ? (
					<p className="text-[11px] font-semibold tracking-wider text-primary uppercase">
						{columnTitle}
					</p>
				) : null}
				<ul
					className={cn(
						"flex flex-col gap-0.5",
						columnTitle && !mobile ? "mt-3" : undefined
					)}
					role="list"
				>
					{items.map((item) => (
						<li key={item.id}>
							<DiscoveryNavItemLink item={item} />
						</li>
					))}
				</ul>
			</div>
		);
	}

	const maxRows = Math.max(...columns.map((column) => column.length));

	return (
		<div
			className={cn(
				"grid gap-x-6 gap-y-0",
				getGridColumnClass(columnCount),
				className
			)}
			role="list"
		>
			{columnTitle ? (
				<>
					<p className="mb-3 text-[11px] font-semibold tracking-wider text-primary uppercase">
						{columnTitle}
					</p>
					{columnCount > 1 ? (
						<div aria-hidden className="mb-3" />
					) : null}
					{columnCount > 2 ? (
						<div aria-hidden className="mb-3" />
					) : null}
				</>
			) : null}

			{Array.from({ length: maxRows }, (_, rowIndex) =>
				columns.map((column, columnIndex) => {
					const item = column[rowIndex];

					return (
						<div
							key={`${columnIndex}-${rowIndex}`}
							className="min-w-0"
						>
							{item ? <DiscoveryNavItemLink item={item} /> : null}
						</div>
					);
				})
			)}
		</div>
	);
};
