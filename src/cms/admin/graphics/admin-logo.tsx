"use client";

import { ADMIN_BRAND_NAME, ADMIN_LOGO_SRC } from "../admin-brand.constants";
import { AdminThemeToggle } from "../admin-theme-toggle";

export function AdminLogo() {
	return (
		<div className="grid grid-cols-[1fr_min-content] gap-4 w-full items-start">
			<div className="grid justify-center">
				<img
					alt={ADMIN_BRAND_NAME}
					className="block h-auto w-[100px]"
					src={ADMIN_LOGO_SRC}
				/>
			</div>
			<AdminThemeToggle />
		</div>
	);
}
