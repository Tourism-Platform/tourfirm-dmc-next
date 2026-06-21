import type { FC, ReactNode } from "react";

import { cn } from "@/shared/lib";

interface ISheetInfoCardProps {
	children: ReactNode;
	className?: string;
}

export const SheetInfoCard: FC<ISheetInfoCardProps> = ({
	children,
	className
}) => (
	<div className={cn("rounded-lg bg-muted px-4 py-4 text-sm", className)}>
		{children}
	</div>
);
