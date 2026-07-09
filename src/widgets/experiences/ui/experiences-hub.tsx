import { Link } from "@/shared/i18n";
import type { TBreadcrumbItem } from "@/shared/lib/routing/build-geo-breadcrumbs";
import { BlocksLayout } from "@/shared/ui/blocks";
import type { TBlockRenderProps } from "@/shared/ui/blocks";
import { ExperienceCard } from "@/shared/ui/cards";
import type { IExperienceCard } from "@/shared/ui/cards/types/experience-card.types";
import { CustomSectionHeader } from "@/shared/ui/custom/custom-section-header";

import { DiscoveryRelatedSection } from "@/widgets/discovery";

type TProps = {
	title: string;
	subtitle?: string;
	eyebrow: string;
	catalogTitle: string;
	catalogDescription: string;
	emptyLabel: string;
	paginationPrevLabel: string;
	paginationNextLabel: string;
	introSections: TBlockRenderProps[];
	cards: IExperienceCard[];
	breadcrumbItems: TBreadcrumbItem[];
	baseHref: string;
	pagination: {
		page: number;
		totalPages: number;
		hasNextPage: boolean;
		hasPrevPage: boolean;
	};
};

export function ExperiencesHub({
	title,
	subtitle,
	eyebrow,
	catalogTitle,
	catalogDescription,
	emptyLabel,
	paginationPrevLabel,
	paginationNextLabel,
	introSections,
	cards,
	breadcrumbItems,
	baseHref,
	pagination
}: TProps) {
	return (
		<div className="flex flex-col">
			<div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
				<CustomSectionHeader
					eyebrow={eyebrow}
					title={title}
					description={subtitle}
				/>
			</div>

			{introSections.length ? (
				<BlocksLayout
					sections={introSections}
					breadcrumbItems={breadcrumbItems}
				/>
			) : null}

			<div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 pb-16 sm:px-6 lg:px-8">
				{cards.length ? (
					<DiscoveryRelatedSection
						eyebrow={eyebrow}
						title={catalogTitle}
						description={catalogDescription}
					>
						{cards.map((card) => (
							<ExperienceCard
								key={card.href ?? card.title}
								data={card}
							/>
						))}
					</DiscoveryRelatedSection>
				) : (
					<p className="text-muted-foreground text-sm">
						{emptyLabel}
					</p>
				)}

				{pagination.totalPages > 1 ? (
					<nav
						className="flex items-center justify-center gap-4"
						aria-label="Experiences pagination"
					>
						{pagination.hasPrevPage ? (
							<Link
								href={
									pagination.page <= 2
										? baseHref
										: `${baseHref}?page=${pagination.page - 1}`
								}
								className="text-sm font-medium text-primary hover:underline"
							>
								{paginationPrevLabel}
							</Link>
						) : null}
						<span className="text-muted-foreground text-sm">
							{pagination.page} / {pagination.totalPages}
						</span>
						{pagination.hasNextPage ? (
							<Link
								href={`${baseHref}?page=${pagination.page + 1}`}
								className="text-sm font-medium text-primary hover:underline"
							>
								{paginationNextLabel}
							</Link>
						) : null}
					</nav>
				) : null}
			</div>
		</div>
	);
}
