import { Link } from "@/shared/i18n";

type TPagination = {
	page: number;
	totalPages: number;
	hasNextPage: boolean;
	hasPrevPage: boolean;
};

type TProps = {
	baseHref: string;
	pagination: TPagination;
	prevLabel: string;
	nextLabel: string;
	ariaLabel: string;
};

export function CmsPagination({
	baseHref,
	pagination,
	prevLabel,
	nextLabel,
	ariaLabel
}: TProps) {
	if (pagination.totalPages <= 1) {
		return null;
	}

	return (
		<div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 pb-16 sm:px-6 sm:py-20 lg:px-8">
			<nav
				className="flex items-center justify-center gap-4"
				aria-label={ariaLabel}
			>
				{pagination.hasPrevPage ? (
					<Link
						href={
							pagination.page <= 2
								? baseHref
								: `${baseHref}?page=${pagination.page - 1}`
						}
						className="text-primary text-sm font-medium hover:underline"
					>
						{prevLabel}
					</Link>
				) : null}
				<span className="text-muted-foreground text-sm">
					{pagination.page} / {pagination.totalPages}
				</span>
				{pagination.hasNextPage ? (
					<Link
						href={`${baseHref}?page=${pagination.page + 1}`}
						className="text-primary text-sm font-medium hover:underline"
					>
						{nextLabel}
					</Link>
				) : null}
			</nav>
		</div>
	);
}
