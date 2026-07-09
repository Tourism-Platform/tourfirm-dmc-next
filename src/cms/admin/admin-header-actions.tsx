"use client";

import { Link, useConfig } from "@payloadcms/ui";

import { ADMIN_BRAND_NAME, ADMIN_LOGO_SRC } from "./admin-brand.constants";
import { AdminThemeToggle } from "./admin-theme-toggle";

export function AdminHeaderActions() {
	const {
		config: {
			routes: { admin }
		}
	} = useConfig();

	return (
		<div className="mr-2 flex items-center gap-3">
			<Link
				className="flex items-center leading-none"
				href={admin}
				prefetch={false}
				title={ADMIN_BRAND_NAME}
			>
				<img
					alt={ADMIN_BRAND_NAME}
					className="block h-7 w-auto object-contain"
					src={ADMIN_LOGO_SRC}
				/>
			</Link>
			<AdminThemeToggle />
		</div>
	);
}
