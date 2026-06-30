import { Link } from "@/shared/i18n";
import type { TBreadcrumbItem } from "@/shared/lib/routing/build-geo-breadcrumbs";
import { cn } from "@/shared/lib/utils";

type TPageBreadcrumbsProps = {
	items: TBreadcrumbItem[];
	className?: string;
};

export function PageBreadcrumbs({ items, className }: TPageBreadcrumbsProps) {
	return (
		<nav
			aria-label="Breadcrumb"
			className={cn("text-muted-foreground text-sm", className)}
		>
			<ol className="flex flex-wrap items-center gap-2">
				{items.map((item, index) => {
					const isLast = index === items.length - 1;

					return (
						<li key={item.href} className="flex items-center gap-2">
							{index > 0 ? <span aria-hidden>/</span> : null}
							{isLast ? (
								<span className="font-medium">
									{item.label}
								</span>
							) : (
								<Link
									href={item.href}
									className="transition-opacity hover:opacity-80"
								>
									{item.label}
								</Link>
							)}
						</li>
					);
				})}
			</ol>
		</nav>
	);
}
