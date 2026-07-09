"use client";

import type { FC } from "react";

import { Link } from "@/shared/i18n";
import { Separator } from "@/shared/ui";

type TProps = {
	href: string;
	label: string;
	className?: string;
};

export const DiscoveryViewAllFooter: FC<TProps> = ({
	href,
	label,
	className
}) => {
	return (
		<div className={className}>
			<Separator />
			<div className="px-5 py-3">
				<Link
					href={href}
					className="text-sm font-medium text-foreground transition-colors hover:text-primary"
				>
					{label}
				</Link>
			</div>
		</div>
	);
};
